import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import type { Options as KyOptions } from "ky";
import ky from "ky";
import Handlebars from "handlebars";
import { httpRequestChannel } from "@/inngest/channel/http-request";

Handlebars.registerHelper("json", function (context) {
  const jsonString = JSON.stringify(context, null, 2);
  const SafeString = new Handlebars.SafeString(jsonString);
  return SafeString;
});

type HttpRequestData = {
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: string;
  variableName?: string;
};

export const HttpRequestExecutor: NodeExecutor<
  HttpRequestData
> = async ({ data, nodeId, context, step, publish }) => {
  const {
    endpoint,
    method = "GET",
    body = "{}",
    variableName,
  } = data;

  await publish(
    httpRequestChannel().status({
      nodeId,
      status: "loading",
    })
  );
  if (!endpoint) {
    await publish(
      httpRequestChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("请求节点：未配置请求地址");
  }

  if (!variableName) {
    await publish(
      httpRequestChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("请求节点：未配置变量名");
  }

  try {
    const result = await step.run(
      "http-request",
      async () => {
        // 编译模板
        // var template = Handlebars.compile("Handlebars <b>{{doesWhat}}</b>");
        // 执行已编译的模板，并将输出结果打印到控制台
        // console.log(template({ doesWhat: "rocks!" }));

        if (!method) {
          await publish(
            httpRequestChannel().status({
              nodeId,
              status: "error",
            })
          );
          throw new NonRetriableError(
            "请求节点：未配置请求方法"
          );
        }

        const compiledEndpoint =
          Handlebars.compile(endpoint)(context);
        const options: KyOptions = { method };

        if (["POST", "PUT", "PATCH"].includes(method)) {
          const resolved =
            Handlebars.compile(body)(context);
          console.log("resolved", resolved);
          JSON.parse(resolved);
          options.body = resolved;

          options.headers = {
            "Content-Type": "application/json",
          };
        }
        const response = await ky(
          compiledEndpoint,
          options
        );
        const contentType =
          response.headers.get("content-type");

        const responseData = contentType?.includes(
          "application/json"
        )
          ? await response.json()
          : await response.text();

        const responsePayload = {
          httpResponse: {
            status: response.status,
            statusText: response.statusText,
            data: responseData,
          },
        };

        // const compileVariableName = Handlebars.compile(variableName)(context);

        // if (variableName) {
        return {
          ...context,
          [variableName]: responsePayload,
        };
        // }
        // return {
        //   ...context,
        //   ...responsePayload,
        // };
      }
    );

    await publish(
      httpRequestChannel().status({
        nodeId,
        status: "success",
      })
    );

    return result;
  } catch (error) {
    await publish(
      httpRequestChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw error;
  }
};

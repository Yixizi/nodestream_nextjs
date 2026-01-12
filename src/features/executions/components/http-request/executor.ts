import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import type { Options as KyOptions } from "ky";
import ky from "ky";
type HttpRequestData = {
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: string;
};

export const HttpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
}) => {
  const { endpoint, method = "GET", body } = data;
  if (!endpoint) {
    throw new NonRetriableError("请求节点：未配置请求地址");
  }

  const result = await step.run("http-request", async () => {
    const options: KyOptions = { method };
    if (["POST", "PUT", "PATCH"].includes(method)) {
      if (body) {
        options.body = body;
      }
    }
    const response = await ky(endpoint, options);
    const contentType = response.headers.get("content-type");

    const responseData = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();
    return {
      ...context,
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    };
  });
  return result;
};

import { parseAsInteger } from "nuqs/server";
import { PAGINATION } from "@/config/constants";

// // clearOnDefault: true 没有传入任何参数，生成的请求不包含 page, pageSize 和 search 参数

export const executionsParams = {
  page: parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PAGE)
    .withOptions({
      clearOnDefault: true,
    }),
  pageSize: parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PAGE_SIZE)
    .withOptions({
      clearOnDefault: true,
    }),
};

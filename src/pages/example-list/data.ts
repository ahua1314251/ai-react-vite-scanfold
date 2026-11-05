/** 本地演示数据，不连接真实接口。 */
export interface ExampleItem { id: number; name: string }
export const exampleItems: ExampleItem[] = Array.from({ length: 18 }, (_, i) => ({ id: i + 1, name: `示例项目 ${i + 1}` }));

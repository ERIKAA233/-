export interface ResponseData {
  code: number,
  message: string,
  ok: boolean,
}
export interface Attr {
  id?: number,
  attrId: number | string,
  valueId: number | string,
  valueName?: number | string,
}
export interface saleAttr {
  id?: number,
  saleAttrId: number | string,
  saleAttrValueId: number | string,
  saleAttrValueName?: number | string,
}
//sku类型
export interface SkuData {
  category3Id?: string | number,
  spuId?: string | number,
  tmId?: string | number,
  skuName?: string,
  price?: string | number,
  weight?: string | number,
  skuDesc?: string,
  skuAttrValueList?: Attr[],
  skuSaleAttrValueList?: saleAttr[],
  skuDefaultImg?: string,
  isSale?: number,//控制商品上下架
  id?: number,
  skuImageList?: any,
}
//获取sku接口返回数据的ts类型
export interface SkuResponseData extends ResponseData {
  data: {
    records: SkuData[],
    total: number,
    size: number,
    current: number,
    orders: [],
    optimizeCountSql: boolean,
    hitCount: boolean,
    countId: null,
    maxLimit: null,
    searchCount: boolean,
    pages: number,
  }
}
//获取sku商品详情
export interface SkuInfoData extends ResponseData {
  data: SkuData;
}
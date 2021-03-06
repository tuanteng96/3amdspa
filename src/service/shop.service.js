import { getToken } from "../constants/user";
import http from "../service/http-common";

class ShopDataService {
    getCate(id, stockid) {
        return http.get(`/app/index.aspx?cmd=cate_parentid&id=${id}&stockid=${stockid}&token=${getToken()}`);
    }
    getList(id, pi, ps, tags, keys, stockid, status) {
        return http.get(`/app/index.aspx?cmd=search_prods&token=${getToken()}&key=${keys}&cates=${id}&pi=${pi}&ps=${ps}&stockid=${stockid}&status=${tags === "hot" ? "3" : status}`);
    }
    getListProduct(id, stockid, count) {
        return http.get(`/app/index.aspx?cmd=search_prods&token=${getToken()}&key=&cates=${id}&pi=1&ps=${count}&tags=&stockid=${stockid}`);
    }
    getTitleCate(id) {
        return http.get(`/api/v3/content?cmd=id&id=${id}&tb=categories&token=${getToken()}`);
    }
    getDetail(id) {
        return http.get(`/app/index.aspx?id=${id}&cmd=prodid&token=${getToken()}`);
    }
    getDetailFull(id, userId) {
        return http.get(`/api/v3/prod?cmd=getid&id=${id}&mid=${userId}&token=${getToken()}`);
    }
    getServiceParent(id, stock, pi, ps, ignorepublic, original) {
            return http.get(`/api/v3/app2?get=sv&cid=${id}&token=${getToken()}&stockid=${stock}&takes=Detail,Desc&pi=${pi}&ps=${ps}${ignorepublic ? `&ignorepublic=${ignorepublic}` : ""}${original? `&rootIds=${original}` : ""}`);
    }
    getServiceParentID(id, stockid) {
        return http.get(`/app/index.aspx?cmd=service_parentid&token=${getToken()}&id=${id}&stockid=${stockid}`);
    }
    getServiceOriginal() {
        return http.get(`/api/v3/prod?cmd=roots&token=${getToken()}`);
    }
    getServiceProdID(id, stockid) {
        return http.get(`/app/index.aspx?cmd=service_prodsid&token=${getToken()}&id=${id}&stockid=${stockid}`);
    }
    getSearchService(keys, cateId, stockid) {
        return http.get(`/app/index.aspx?cmd=search_prods&token=${getToken()}&key=${keys}&cates=${cateId}&pi=1&ps=1000&stockid=${stockid}`);
    }
    getProd() {
        return http.get(`/app/index.aspx?cmd=ProdService&token=${getToken()}`);
    }
    addProduct({USN, PWD, data}) {
        return http.post(`/app/index.aspx?cmd=add_OrderAdd&USN=${USN}&PWD=${PWD}&IsUser=0`,data)
    }
    addQtyProduct({USN, PWD, data}) {
        return http.post(`/app/index.aspx?cmd=qty_OrderAdd&USN=${USN}&PWD=${PWD}&IsUser=0`,data)
    }
    deleteOrderItem({USN, PWD, data}) {
        return http.post(`/app/index.aspx?cmd=delete_OrderAdd&USN=${USN}&PWD=${PWD}&IsUser=0`,data)
    }
    payWalletOrder({USN, PWD, data}) {
        return http.post(`/app/index.aspx?cmd=membermoney_OrderAdd&USN=${USN}&PWD=${PWD}&IsUser=0`,data)
    }
    voucherOrder({USN, PWD, data}) {
        return http.post(`/app/index.aspx?cmd=voucher_OrderAdd&USN=${USN}&PWD=${PWD}&IsUser=0`,data)
    }
    voucherByOrder({USN, PWD, OrderAddID, Voucher}) {
        return http.get(`/api/v1/?cmd=order_by_voucher&vcode=${Voucher}&USN=${USN}&PWD=${PWD}&OrderAddID=${OrderAddID}`)
    }
    getOrder({ USN, PWD, OrderID }) {
        return http.get(`/app/index.aspx?cmd=getOrder&OrderID=${OrderID}&USN=${USN}&PWD=${PWD}&IsUser=0`);
    }
    finishOrder({ USN, PWD, data }) {
        return http.post(`/app/index.aspx?cmd=finish_OrderAdd&USN=${USN}&PWD=${PWD}&IsUser=0`, data);
    }
    getUpdateOrder(data) {
        return http.post(`/api/v3/orderclient?cmd=get&token=${getToken()}`, data);
    }
    searchVoucher(data) {
        return http.get(`/api/v3/VoucherClient?cmd=precheck&token=${getToken()}&orderid=${data.orderId}&vcode=${data.vcode}`);
    }
    searchProd(data) {
        return http.get(`/app/index.aspx?cmd=search_prods&token=${getToken()}&key=${data.key}&cates=&pi=1&ps=${data.count}&tags=&stockid=${data.stockid}`);
    }
}

export default new ShopDataService();
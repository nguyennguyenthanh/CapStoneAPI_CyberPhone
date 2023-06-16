//Function Call API from Sever
export function Api() {
    this.callApi = function (uri, method, data) {
        let url = "https://64709e2f3de51400f724a01e.mockapi.io";
        return axios({
            url: `${url}/${uri}`,
            method: method,
            data: data,
        });
    }
}

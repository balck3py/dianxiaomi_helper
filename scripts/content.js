function initData(){
  const xianshishujudate = document.getElementsByClassName('xianshishujudate');
  const msg = '未找到待处理订单，请确保选中了‘待处理’模块并存在未处理订单';
  const detail_url = 'https://www.dianxiaomi.com/package/detail.htm';

  if (xianshishujudate?.length) {
    const dataList = xianshishujudate[0].querySelectorAll('[class^="orderId_"]');
    if (dataList?.length) {
      // 写入标记
      const hid = document.createElement('input');
      hid.id = 'dianxiaomi_helper_result';
      hid.type = 'hidden';
      hid.value = '0';
      xianshishujudate[0].insertAdjacentElement("beforeend", hid);

      console.log(`共获取到${dataList?.length}条待处理订单`)
      dataList.forEach((data, index) => {
        const orderId = data.getAttribute('data-orderid');
        console.log(`当前开始处理第${index + 1}条订单编号为：${orderId}的订单`);

        const req = new XMLHttpRequest();
        const body = `packageId=${orderId}&history=`;
        req.open("POST", detail_url, true);
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
        req.send(body);
        
        req.onreadystatechange = function(){ // Call a function when the state changes.
          if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(req.response, "text/html");
            const textContent = doc.body.textContent.replace(/\n/g, '').replace(/\s/g, '');
            const regex = /可用库存help_outline：(\d+)更换解除/;
            const match = textContent.match(regex);
            if (match) {
              const tableOrderId = data.querySelector('td.tableOrderId');
              tableOrderId.innerHTML += `<b>可用库存为：${match[1]}</b>`;
            }
          }
        }
      })

      // 写入标记
      const dianxiaomi_helper_result = document.getElementById('dianxiaomi_helper_result');
      if(dianxiaomi_helper_result) {
        dianxiaomi_helper_result.value = '1';
      }
    }
  }
}
function detectElement() {
  const result = document.getElementById('dianxiaomi_helper_result');
  if(result){
    return;
  } else {
    initData();
  }
}
var timer = setInterval(() => {
  detectElement();
}, 1000);
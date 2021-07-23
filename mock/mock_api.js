/**
* 序列參數轉物件格式
* @param {*} entries - key & value
* @returns {Object} A JSON object
*/
function params2Obj ( entries ) {
  const result = {};

  for ( const [key, value] of entries ) {
    result[key] = value;
  }

  return result;
}

const _path = '/user/info';
const MOCKDATA = {
  'data|20': [
    {
      'id|+1': 1,
      name: '@name(true)',
      color: '@color',
      image: Mock.Random.image( '120x60', '#0099CC', '#FFF', 'image' ),
      disc: '@paragraph(1)',
    },
  ],
};

// 模擬傳送延遲時間
Mock.setup( {
  timeout: 500,
} );

// 取得資料 api
Mock.mock( _path, 'get', MOCKDATA );
// 傳送資料 api
Mock.mock( _path, 'post', function ( res ) {
  console.log( res.body );
  // 將序列參數轉物件格式
  const urlParams = new URLSearchParams( res.body );
  const entries = urlParams.entries();
  const params = params2Obj( entries );

  // 回傳請求資料
  return Mock.mock( {
    'data|1': [
      {
        name: params.name,
        color: '@color',
        image: Mock.Random.image( '100x50', '#ff9900', '#FFF', 'mock' ),
        disc: params.disc,
      },
    ],
  } );
} );

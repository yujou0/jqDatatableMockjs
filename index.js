const express = require("express");
// const chance = require("chance").Chance();
// const shuffleArray = require("shuffle-array");
const Mock = require( 'mockjs' );

const app = express();
const bodyParser = require( 'body-parser' );
// const userData = require( './data/data' ); 

// 利用 mock extend method 自訂手機號碼資料格式
Mock.Random.extend( {
    phone: function () {
        var phonePrefixs = '09'
        // Number()
        return this.pick( phonePrefixs ) + Mock.mock( /\d{2}\-\d{6}/ )
    }
} );

// 創建資料物件格式
const MOCKDATA = {
    'data|50': [
        {
            'id|+1': 1,
            name: '@name(true)',
            email: '@email',
            phone: '@phone',
            date: '@now()',
        },
    ],
};

// 取得 mock 生成的資料
const userData = Mock.mock( MOCKDATA ).data;
// var data = JSON.parse(userData);

// 提供影像、CSS 檔案和 JavaScript 檔案等之類的靜態檔案，
// 使用 Express 中的 express.static 內建中介軟體函數。
// 將含有靜態資產的目錄名稱傳遞給 express.static 中介軟體函數，就能直接開始提供檔案。
// 舉例來說，使用下列程式碼在名稱是 public 的目錄中，提供影像、CSS 檔案和 JavaScript 檔案：
app.use(express.static(`public`))
app.use( bodyParser.json() );

// const data = {
//     headers:["Name","Age","Profession","Country"],
//     rows: new Array(10).fill(undefined).map(() => {
//         return [
//             chance.name(),
//             chance.age(),
//             chance.profession(),
//             chance.country({ full: true })
//         ];
//     })
// };

// app.get("/data",(req, res) => {
//     res.json({
//         headers:data.headers,
//         rows:shuffleArray(data.rows),
//         lastUpdated: new Date().toISOString()
//     });
// })
// // 取得全部資料
// app.get( '/index.html', function ( req, res ) {
//     // res.sendFile( `public` + "/" + "index.html" );
//     res.send({userData})
// } )

// 取得全部資料
app.get( '/data', function ( req, res ) {
    // res.sendFile( `public` + "/" + "index.html" );
    res.send({userData})
} )

// 取得單筆資料
app.get( '/data' + '/:id', function ( req, res ) {
    const id = req.params.id;
    let arr = [];

    userData.forEach( function ( obj, index ) {
        if ( obj.id === id ) {
            arr.push( userData[index] );
        }
    } );

    res.send( arr );
} )

// 新增資料
app.post( '/data', function ( req, res ) {
    const newID = userData.length + 1;
    const newData = {
        id: newID,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        date: new Date().toISOString().slice( 0, 10 )
    };

    userData.push.apply( userData, [newData] );

    res.send( newData );
} );

// 修改單筆資料
app.put( '/data' + '/:id', function ( req, res ) {
    const id = req.params.id;
    const newName = req.body.name;
    const newEmail = req.body.email;
    const newPhone = req.body.phone;
    const updateData = {
        id: id.toString(),
        name: newName,
        email: newEmail,
        phone: newPhone,
        date: new Date().toISOString().slice( 0, 10 )
    };

    userData.forEach( function ( obj, i ) {
        if ( obj.id === id ) {
            obj.name = newName;
            obj.email = newEmail;
            obj.phone = newPhone;
        }
    } );

    res.send( updateData );
} );

// 刪除單筆資料
app.delete( '/data' + '/:id', function ( req, res ) {
    const id = req.params.id;

    userData.forEach( function ( obj, i ) {
        if ( true && obj.id === id ) {
            userData.splice( i, 1 );
        }
    } );

    res.send( {
        id: id,
        data: userData
    } );
} );

app.listen(3001, () => console.log("app is running"));
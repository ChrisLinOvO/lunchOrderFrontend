import React, { useState, useEffect } from 'react';
import OrderTable from '../../components/OrderTable';
import Menu from '../../components/Menu';

const  Lunch =(props)=> {
    const tarProps = { //訂單
        dbName: "orders",
        keys: {
            name: {
                type: "input",
                text: "姓名"
            },
            text: {
                type: "input",
                text: "文字"
            },
            money: {
                type: "input",
                text: "金額"
            },
          
    
        }
    }

    const menuProps = { //菜單
        dbName: "uploads",
        keys: {
            createAt:{
                type:'none',
                text:'建立時間'
            },
            files: {
                type: "uploads",
                text: "菜單"
            },
          
          
    
        }
    }

    const [myListData, setMyListData] = useState([]);//訂單
    const [myMenuData, setMyMenuData] = useState([]);//菜單
    const [myListDataAll, setMyListDataAll] = useState([]);
    const [totalAllProps, seTotalAllProps] = useState([]);//總金額
    const [payOk, setPayOk] = useState([]);//付錢
    useEffect(() => {

         
        const idNo = [false]
        const payNo =  [...myListData].filter( i => idNo.includes( i.pay ) ).map(x=>x.name);
        const idYes = [true]
        const payYes =  [...myListData].filter( i => idYes.includes( i.pay ) ).map(x=>x.money).reduce(function(a, b) {
            return parseInt(a) + parseInt(b);
        }, 0);


       console.log("payNo",payNo)
       console.log("payYes",payYes)
       props.setPayNoArr(payNo)
       props.setPayYes(payYes)
           

     
    }, [myListData]);

    useEffect(() => {

        const sortedArr = [...myListDataAll].map((e) => {
            let hasIncludes = false;
            Object.keys(e).forEach((ee) => {
                let val2 = e[ee];
                if (val2.toString().includes(props.filterStr)) hasIncludes = true;
            })
            if (hasIncludes) return e;
            return false;
        }).filter((e) => e !== false);
        setMyListData([...sortedArr]);
    }, [props.filterStr]);


    useEffect(() => {

         

        const pay =  [...totalAllProps].map(x=>parseInt(x.money)).reduce(function(a, b) {
            return a + b;
        }, 0);

       console.log("pay",pay)
           
       props.setPayAllTotal(pay)
     
    }, [totalAllProps]);

    // useEffect(() => {

         

    //     const payOkRes =  [...payOk].reduce(function(a, b) {
    //         return parseInt(a) + parseInt(b);
    //     }, 0);

    //    console.log("payOk",payOkRes)
    //    props.setPayOkTotal(payOkRes)  

     
    // }, [payOk]);
    return (
        <>
                 
                <OrderTable 
                tarProps={tarProps} 
                listData={myListData} 
                listDataProps={data => setMyListData([...data])} 
                listDataAllProps={data => setMyListDataAll([...data])}  
                payAllTotalProps={data => seTotalAllProps([...data])} 
                // setPayOkProps={data =>setPayOk([...payOk,...[data]])}

                />
                <br /><br />
                <Menu menuProps={menuProps} menuData={myMenuData} menuDataProps={data => setMyMenuData([...data])}  />
        </>
    );
}

export default Lunch;

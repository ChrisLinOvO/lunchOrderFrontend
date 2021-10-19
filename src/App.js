import React, { useState } from 'react';
import { Input } from '@alifd/next';
import './App.css';
import Lunch from './pages/Lunch';

const App = () => {
  const [tFilterStr, setTFilterStr] = useState('');
  const [payAllTotal, setPayAllTotal] = useState(0);
  const [payOkTotal, setPayOkTotal] = useState(0);
  const [payNoArr, setPayNoArr] = useState([]);
  const [payYes, setPayYes] = useState(0);
 

  function searchRender(value) {//input search filter

    setTFilterStr(value);
  }
  return (
    <div className="app">
      <div  className="title">EZCON點餐系統後台</div>
      <div className="box">
        <Input
          
          size="large"
          placeholder="輸入搜尋文字"
          onChange={searchRender}
          aria-label="this is input"
        />
        <div className="payText">總金額:{payAllTotal}元</div>
        <div  className="payText">已收:{payYes}元</div>
        <div  className="payText">未付錢:{payNoArr&&payNoArr.length>0?payNoArr.join():"都付錢了"}</div>

        </div>
     <br/><br/>
      <Lunch filterStr={tFilterStr} setPayAllTotal={setPayAllTotal} setPayOkTotal={setPayOkTotal} setPayNoArr={setPayNoArr} setPayYes={setPayYes}/>
     
    </div>
  );
}

export default App;

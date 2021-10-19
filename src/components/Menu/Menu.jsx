import React, { useState, useEffect, useRef, Fragment } from 'react';
import {
  Button,
  Dialog,
  Input,
  Form,
  Select,
  DatePicker,
  Message,
  Card,
  Table,
  Pagination
} from "@alifd/next";
import Swal from 'sweetalert2';
import client from '../../lib/feathers';
import axios from 'axios';
import moment from 'moment';
import './Menu.css';
import ModalImage from "react-modal-image";
const Option = Select.Option;
const { Item } = Form;
const Menu = (props) => {
  const { dbName, keys, text } = props.menuProps;
  const dbService = client.service(`${dbName}`);

  const [writeData, setWriteData] = useState({});
  const [popupState, setPopupState] = useState(false);
  const [editKey, setEditKey] = useState(false);
  const [editIndex, setEditIndex] = useState("");
  //uploads files
  const [parsed, setParsed] = useState([]);
  const [parsed64, setParsed64] = useState([]); //Base64
  const [file, setFile] = useState("");
  const uploadFile = useRef(null);
  const uploadExcelFile = useRef(null);
  // sort
  const [curdataIndex, setcurDataIndex] = useState('createAt');
  const [curorder, setcurOrder] = useState('asc');
  // change page
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = props.menuData.slice(indexOfFirstPost, indexOfLastPost);
  // dbService
  async function funFind(para) {
    const result = await dbService.find({ query: para });
    // console.log(result);
    return result && result.data ? result.data : [];
  }

  async function funCreate(obj) {
    return (await dbService.create(obj))
  }
  async function funUpdate(id, obj) {
    return (await dbService.patch(id, obj))
  }
  async function funRemove(id) {
    return (await dbService.remove(id))
  }
  const serverDataUpdate = (dataIndex, order) => {
    const rdataIndex = dataIndex || curdataIndex;
    const rorder = order || curorder;

    funFind({}).then((result) => {
      const sortedArr = result.sort((a, b) => {
        const result = (typeof a[rdataIndex] === 'number'
          ? a[rdataIndex].toString()
          : a[rdataIndex]
        ).localeCompare(
          typeof b[rdataIndex] === 'number'
            ? b[rdataIndex].toString()
            : b[rdataIndex]
        );
        return rorder === 'asc' ? (result > 0 ? 1 : -1) : result > 0 ? -1 : 1;
      })
      props.menuDataProps(sortedArr);
      // props.listDataAllProps(sortedArr)
    });


  };
  const onTableSort = (dataIndex, order) => {
    console.log('==dataIndex:', dataIndex, 'order:', order);
    setcurDataIndex(dataIndex);
    setcurOrder(order);
    serverDataUpdate(dataIndex, order);
  };

  useEffect(() => {
    serverDataUpdate();
  }, []);



  function beforeUpload() {
    return new Promise(async (resolve, reject) => {
      if (uploadFile.current.files.length > 0) {
        const isLt20M =
          (await uploadFile.current.files[0].size) / 1024 / 1024 < 20;

        if (!isLt20M) {
          Message.error('Image must smaller than 20MB!');
          return reject();
        }
        resolve(isLt20M);
      } else {
        setParsed64('')
      }
    });
  }

  const handleFiles = async () => {
    try {
      await beforeUpload();
      const files = [...parsed];
      const data = await uploadFile.current.files[0];
      // console.log(data)
      files.push(data);
      setParsed(files);

      //轉Base64 上傳檔案後呈現沒有寫到DB
      const reader = new FileReader();
      reader.onload = function () {
        let dataURL = reader.result;
        setParsed64(dataURL);
      };
      reader.readAsDataURL(data);
    } catch (err) {
      console.log(err);
    }
  };

  const addCreateData = (key, value) => {
    //-------Input OnChange Event
    let obj = {};
    obj[key] = value;

    setWriteData({ ...writeData, ...obj });
  };
  const createSend = () => {
    //-------Create Data 送出
    Swal.fire({
      title: `確定新增此資料?`,
      text: '請確認資料填寫完整!!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#BEBEBE',
      confirmButtonText: '確定',
      cancelButtonText: '取消',
    }).then((result) => {
      if (result.isConfirmed) {
        createUploads().then((res) => {
          Swal.fire('成功!', `此資料已新增`, 'success');
          console.log('==create success:', res);
          serverDataUpdate();
          setWriteData({});
          setParsed64('');
          setEditKey(false);
          setPopupState(false);
        }).catch((error) => {
          console.log('==create fail:', error);
          // Message.error(`${err}`);
        })

      }
    });


  };



  const typeComponents = (e, type) => {
    // Render Type Components
    let element;
    switch (type) {
      case "input":
        element = (
          <Input
            value={writeData[e]}
            onChange={(value) => {
              addCreateData(e, value);
            }}
            placeholder={e}
          />
        );
        break;
      case "datePicker":
        element = (
          <DatePicker
            value={writeData[e]}
            placeholder={e}
            onChange={(value) => {
              addCreateData(e, moment(value).format("YYYY-MM-DD"));
            }}
          />
        );
        break;
      case "textArea":
        element = (
          <Input.TextArea
            value={writeData[e]}
            placeholder={e}
            maxLength={500}
            rows={6}
            hasLimitHint
            aria-label="input max length 500"
            onChange={(value) => {
              addCreateData(e, value);
            }}
          />
        );
        break;
      case "select":
        element = (
          <Select
            value={writeData[e]}
            hasClear
            style={{ width: '100%' }}
            placeholder={e}
            dataSource={props.categoryProps}
            onChange={(value) => {
              addCreateData(e, value);
            }}
          />
        );
        break;
      case "uploads":
        element = (
          <>
            <input
              accept="image/png, image/jpeg ,image/jpg"
              ref={uploadFile}
              onChange={handleFiles}
              type="file"
              id="file"
              name="files"
            // multiple
            />
            {editKey == true ?
              <img
                style={{ width: '50px', height: '50px' }}
                src={`${parsed64.length > 0 ? parsed64 : currentPosts[editIndex].files}`}
                alt="圖片"
              />

              : null

            }

            <img className="file" src={`${parsed64.length > 0 ? parsed64 : null}`} alt="圖片"></img>
          </>);
        break;
      case "multiSelect":
        element = (
          <>
            <Select
              mode="multiple"
              value={writeData[e]}
              showSearch
              onChange={(value) => {
                addCreateData(e, value);
              }}
              dataSource={props.venderNameProps}
              style={{ width: '100%' }}
            />

          </>);
        break;
    }
    return element;
  };

  function patchUploads(data) {//edit uploads patch
    // console.log("data",data)

    Swal.fire({
      title: `確設定此菜單為本日菜單?`,
      text: '麻煩再次確認哦～～',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#BEBEBE',
      confirmButtonText: '確定',
      cancelButtonText: '取消',
    }).then((result) => {
      if (result.isConfirmed) {
        funUpdate(data._id, { isMenu: "good" }).then((res) => {
          console.log('==update success:', res);
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: '設定成功',
            showConfirmButton: false,
            timer: 1500,
          });
          serverDataUpdate();
          setWriteData({});
          setParsed64('');
          setEditKey(false);
          setPopupState(false);
        })
          .catch((error) => {
            console.log('==update fail:', error);
            Message.success('設定失敗');
          });

      }
    });



  }


  function createUploads() {//Use uploads create
    return new Promise(async (resolve, reject) => {
      try {

        const formData = new FormData();
        Object.keys(writeData).forEach((eKey) => {

          if (eKey == "vendorName") {
            formData.append("vendorName", JSON.stringify(writeData[eKey]));
          } else {
            formData.append(eKey, writeData[eKey]);
          }
        });

        if (uploadFile.current !== null && uploadFile.current.files && uploadFile.current.files.length > 0) {
          formData.append('files', uploadFile.current.files[0]);
        }

        const Res = await axios(`/uploads`, {
          method: 'POST',
          headers: { authorization: window.localStorage['feathers-jwt'] },
          data: formData
        });

        resolve(Res);
      } catch (error) {
        reject(error);
      }
    })

  }

  // function patchUploads(data) {//Use uploads patch
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       let patchUrl = `/uploads?type=${dbName}&id=${data._id}`
  //       const formData = new FormData();

  //       const passKeys = ['files', '_id'];//禁止FormData Patch add Key

  //       Object.keys(data).forEach((eKey) => {

  //         if (!passKeys.includes(eKey)) {
  //           if (eKey == "vendorName") {
  //             formData.append("vendorName", JSON.stringify(writeData[eKey]));
  //           } else {
  //             formData.append(eKey, writeData[eKey]);
  //           }
  //         }
  //       });

  //       if (uploadFile.current.files.length > 0) {
  //         formData.append('files', uploadFile.current.files[0]);
  //       }
  //       if (!uploadFile.current.files.length) {
  //         patchUrl = `/uploads?type=${dbName}&id=${data._id}&img=keep`
  //       }
  //       console.log('rdy to PP:', formData);
  //       const Res = await axios(patchUrl, {
  //         method: 'PATCH',
  //         headers: { authorization: window.localStorage['feathers-jwt'] },
  //         data: formData
  //       });

  //       resolve(Res);
  //     } catch (error) {
  //       console.log('PP err:', error);
  //       reject();
  //     }
  //   })
  // }






  return (
    <>
      <Dialog

        hasMask={false}
        visible={popupState}
        onOk={() => {
          createSend();
        }}
        onCancel={() => {
          setPopupState(false);
          setEditKey(false);
          setWriteData({});
        }}
        onClose={() => {
          setPopupState(false);
          setEditKey(false);
          setWriteData({});
        }}
      >
        {[...Object.keys(keys)].map((e, nb) => {
          //-------Render Create Element
          const type = keys[e].type;
          if (keys[e].text == "建立時間" || keys[e].text == "修改時間" || keys[e].text == "證照") return "";
          return <Fragment key={keys[e].text}>
            <Form>

              <Item label={keys[e].text} >
                {typeComponents(e, type)}
              </Item>

            </Form>
          </Fragment>;
        })}
      </Dialog>

      <div className="addBox">
        <Button
          type="primary"
          onClick={() => {
            setPopupState(true);
          }}
        >
          新增菜單
                </Button>


      </div>
      {currentPosts && currentPosts.length > 0 ?

        <Table dataSource={currentPosts} onSort={onTableSort}>
          {[...Object.keys(keys)].map((list) => {
            //  -------Render Table Data

            if (list == "files") {
              return <Table.Column width={200} key={keys[list].text} title={keys[list].text} cell={(record, index) => {

                return (<>
                  {/* {currentPosts[index].files.length > 0 ?
                    <img alt="No Data" src={currentPosts[index].files} /> : null} */}
                  <ModalImage
                    className="file"
                    small={currentPosts[index].showPath}
                    large={currentPosts[index].showPath}
                    alt="菜單"
                  />


                </>)
              }
              } />
            } else if (list == "createAt") {
              return <Table.Column sortable width={200} key={keys[list].text} title={keys[list].text} dataIndex={list} cell={(record, index) => {

                return (<>
                  {new Date(currentPosts[index].createAt).toLocaleString()}

                </>)
              }
              } />
            } else if (list == "createTime") {
              return <Table.Column sortable width={200} key={keys[list].text} title={keys[list].text} dataIndex={list} cell={(record, index) => {

                return (<>
                  {new Date(currentPosts[index].createTime).toLocaleString()}

                </>)
              }
              } />
            } else if (list == "updateTime") {
              return <Table.Column sortable width={200} key={keys[list].text} title={keys[list].text} dataIndex={list} cell={(record, index) => {

                return (<>
                  {new Date(currentPosts[index].updateTime).toLocaleString()}

                </>)
              }
              } />
            } else if (list == "vendorName") {
              return <Table.Column width={200} key={keys[list].text} title={keys[list].text} cell={(record, index) => {

                return (<>
                  {currentPosts[index].vendorName.length > 0 ?
                    currentPosts[index].vendorName.map((list, index) => {

                      return (
                        <p key={index}>{list}</p>
                      )

                    })

                    : null}

                </>)
              }
              } />
            } else if (list == "vendorLicense") {
              return <Table.Column sortable width={200} key={keys[list].text} title={keys[list].text} cell={(record, index) => {

                return (<>
                  {currentPosts[index].vendorLicense.length > 0 ?
                    currentPosts[index].vendorLicense.map((list, index) => {

                      return (
                        <p key={index}>{list.name}</p>
                      )

                    })

                    : null}

                </>)
              }
              } />
            } else {
              return <Table.Column sortable key={keys[list].text} title={keys[list].text} dataIndex={list} width={200} />
            }

          })}
          <Table.Column
            width={200}
            title="操作"
            cell={(record, index, value) => {
              // console.log("=====hi~~",record, index, value)
              return (
                <div className="btnBox">
                  <Button
                    type="normal"
                    onClick={() => {
                      patchUploads(value)
                    }}
                  >
                    設為今日菜單
                    </Button>

                  <Button
                    type="primary"
                    warning
                    onClick={() => {
                      const item = currentPosts[index];
                      Swal.fire({
                        title: `確定刪除此資料?`,
                        text: '刪除後將無法復原!!',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#BEBEBE',
                        confirmButtonText: '確定',
                        cancelButtonText: '取消',
                      }).then((result) => {
                        if (result.isConfirmed) {
                          Swal.fire('刪除!', `此資料已刪除`, 'success');
                          funRemove(item._id).then(() => {
                            const prePages =
                              currentPage - 1 >= 0 ? currentPage - 1 : 0;
                            if (
                              props.menuData.length - 1 <=
                              prePages * postsPerPage
                            ) {
                              setCurrentPage(
                                currentPage - 1 < 1 ? 1 : currentPage - 1
                              );
                            }

                            serverDataUpdate();
                          });
                        }
                      });
                    }}
                  >
                    刪除
                             </Button>
                </div>
              );
            }}
          />
        </Table>
        : null}




      <Pagination

        total={props.menuData.length}
        pageSize={postsPerPage}
        totalRender={(total) => `Total: ${total}`}
        onChange={(pageNumber) => {
          setCurrentPage(pageNumber);
        }}
      />





    </>
  );
}

export default Menu;

import { useState } from 'react'
import './App.css'
import { create } from 'ipfs-http-client'

const UploadTable = () => {
    // name 會影響 value，nameChange 會改變 name。(雙向綁定)
    // 設定作品名稱的初始值(所以打完這邊去輸入input是輸入不了的)
    const [name,setName] = useState("") // name所以輸入的順序為 name 預設 value 為"" =>
    const [img,setImg] = useState("")   // user 觸發 onChange 所以呼叫 nameChange() =>
    function nameChange(e) {            // 因為 setName() 的關係將 name 設定為當前 input 內的 value =>          
       setName(e.target.value)          // 因為 name 從 "" 變為 input 內的 value 所以前端的 input 就可以顯示出來。(img一樣的道理)
    }
    const [file,setFile] = useState("") // 取得 file 的值
    function imgChange(e){
        setImg(e.target.files[0].name)  // 將 e.target.value 改為 => e.target.files[0].name 即可解決 fakepath 的問題
        setFile(e.target.files[0])
    }
    function clear(){
        setName("") // 利用上面的方式，將 input 內的 value 再次改為 ""  
        setImg("")
        console.log("清除成功!")
    }
    const client = create('https://ipfs.infura.io:5001/api/v0')
    async function send(){
        console.log('上傳檔案中...')
        try {
            const added = await client.add(file)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            setImg(url)
            //console.log(url)
            const jsonInfo = {"name" : name, "image" : url}
            const jsonFile = JSON.stringify(jsonInfo)
            console.log(jsonFile)
            console.log('將Json檔上傳至IPFS中...')
            const json = await client.add(jsonFile)
            const jsonUrl = `https://ipfs.infura.io/ipfs/${json.path}`
            console.log(jsonUrl)
        }
        catch (error) {
            console.log('Error uploading file: ', error)
        }
    }

    return (
    <div id="signin">
        <table>
            <tbody>
                <tr>
                    <td>作品名稱:</td>
                    <td><input required placeholder="請輸入作品名稱" maxLength="20" size="23" value={name} onChange={nameChange}></input></td>
                </tr>
                <tr>
                    <td>選擇圖片:</td>
                    <td><input required type="file" accept="image/*" defaultValue={img} onChange={imgChange}></input></td>
                </tr>
                <tr>
                    <td colSpan="2">
                        <button type="button" width="50%" onClick={clear}>重新輸入</button>
                        <button type="button" width="50%" onClick={send}>送出</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div>
            <img src={img} alt='some value' width="600px" />
        </div>
    </div>);
}
/*  <img src={img} width="600px" /> 內增加 alt='some value'
    即可解決 img elements must have an alt prop, either with meaningful text, or an empty string for decorative images的問題 */
export default UploadTable;

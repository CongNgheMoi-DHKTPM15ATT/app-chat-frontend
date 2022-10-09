import { Button, Form } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { SendOutlined } from "@ant-design/icons";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";

// const socket = io("https://halo-chat.herokuapp.com");

function Chat(){
    // const [isConnected, setIsConnected] = useState(socket.connected);
    // useEffect(() =>{
    //     socket.on('connect', (socket) => {
    //         console.log("connect socket with id: " + socket.id);
    //         setIsConnected(true);
    //       });
    // },[]);
    const handleEmitMessage = (()=>{
        let _text = document.getElementById("mess-text").innerHTML.trim();
        document.getElementById("mess-text").value = "";
        // nguyenhainam_01 = 634255ff21fbe65180fa2f07;
        // reseiver_id = 63425121c536a187791692d0;
        // socket.emit('sendMessage', {
        //     senderId: "63417151a91aadf420e95dce", 
        //     receiverId: "63425121c536a187791692d0", 
        //     text: {_text},
        // })

        // socket.on('getMessage', function(data) {
        //     console.log("nhận được: " + data);
        // });
    });

    return (
        <div className="chat">
            <div className="chat-header">
                <div className="chat-header-info">

                </div>
                <div className="chat-header-toolbar">

                </div>
            </div>
            <div className="chat-center">
                <div className="chat-center-message">

                </div>
            </div>
            <div className="chat-footer">
                <div className="chat-footer-toolbar">

                </div>
                <Form  className="chat-footer-input">
                    <Form.Item className="chat-footer-input-form">
                        <TextArea rows={3}  placeholder="Nhập tin nhắn...." className="text-area"
                        name="text" id="mess-text"
                        onPressEnter={handleEmitMessage}>
                        </TextArea>

                    </Form.Item>
                    <Form.Item className="chat-footer-input-action">
                        {/* <Button htmlType="submit" className="action-icon"><SendOutlined /></Button> */}
                        <Button className="action-icon" onClick={handleEmitMessage}> Gửi<SendOutlined /></Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default Chat;
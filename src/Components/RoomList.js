import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import { Jumbotron, Spinner, Form, Button, FormGroup, Label, Input, ListGroup, ListGroupItem } from "reactstrap";
import firebase from "../Firebase";
import Moment from "moment";

function RoomList() {
    const [room, setRoom] = useState([]);
    const [showLoading, setShowLoading] = useState(true);
    const [nickname, setNickName] = useState('');
    const history = useHistory();

    useEffect(() => {
        const fetchData = async () => {
            setNickName(localStorage.setItem('nickname'));
            firebase.database().ref('rooms/').on('value', resp => {
                setRoom([]),
                setRoom(snapshotToArray(resp));
                setShowLoading(false);
            });
        };
        fetchData();
    }, []);

    const snapshotToArray = (snapshot) =>{
        const returnArr = [];

        snapshot.forEach((childSnapshot) => {
            const item = childSnapshot.val();
            item.key = childSnapshot.key;
            returnArr.push(item);
        });
        return returnArr;
    }

    const enterChatRoom = (roomname) => {
        const chat = { roomname: '', nickname: '', message: '', date: '', type: '' };
        chat.roomname = roomname;
        chat.nickname = nickname;
        chat.date = Moment(new Date()).format('DD/MM/YYYY HH:mm:ss');
        chat.message = `${nickname} enter the room`;
        chat.type = 'join';
        chat.newMessage = firebase.database().ref('chats/').push();
        newMessage.set(chat);

        firebase.database.ref('roomusers/').orderByChild('roomname').equalTo(roomname).on('value', (resp) => {
            let roomuser = [];
            roomuser = snapshotToArray(resp);
            const user = roomuser.find(x => x.nickname === nickname);
            if( user !== undefined ) {
                const userRef = firebase.database().ref('roomusers/' + user.key);
                userRef.update({ state: 'online' });
            } else {
                const newroomuser = { roomname: '', nickname: '', status: '' };
                newroomuser.roomname = roomname;
                newroomuser.nickname = nickname;
                newroomuser.status = 'online';

                const newRoomUser = firebase.database().ref('roomusers/').push();
                newRoomUser.set(newroomuser);
            }
        });

        history.push('/chatroom/' + roomname);
    }

    const logout = () => {
        localStorage.removeItem('nickname');
        history.push('/login');
    }

    return (
        <div>
            {showLoading && <Spinner color='primary' />}
            <Jumbotron>
                <h3>
                    {nickname}
                    <Button onClick={ () => { logout() } } >Logout</Button>
                </h3>
                <h2>
                    RoomList
                </h2>
                <div>
                    <Link to='/addroom'>Add Room</Link>
                </div>
                <ListGroup>
                    { room.map((item, idx) => (
                        <ListGroupItem key={idx} action onClick={() => { enterChatRoom(item.roomname)}} >
                            {item.roomname}
                        </ListGroupItem>
                    ))}
                </ListGroup>
            </Jumbotron>
        </div>
    );
}

export default RoomList;
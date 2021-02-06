import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DashboardPage = (props)=> {
    const [channels, setChannel] = React.useState([]);
    const [refresh, setRefresh] = React.useState(false);

    const getChannels = () => {
        axios.get('http://localhost:8000/channel', {
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("Chat_Token"),
            },
        }).then(response =>{
            setChannel(response.data);

        }).catch((err) => {
            setTimeout(getChannels, 3000);
        });
    };

    const postChannel = () => {
      axios.post('http://localhost:8000/channel', {
        name : document.getElementById("channelName").value
      }, {
        headers: {
        Authorization: "Bearer " + sessionStorage.getItem("Chat_Token"),
      }}).then(response =>{
        setRefresh(!refresh);
        console.log(response);
      }).catch((err) => {
        setTimeout(postChannel, 3000);
      });
    };

    const deleteChannel = (id) => {
      axios.delete('http://localhost:8000/channel/' + id, {
        name : document.getElementById("channelName").value
      }, {
        headers: {
          Authorization: "Bearer" + sessionStorage.getItem("Chat_Token"),
        }}).then(response => {
          setRefresh(!refresh);
        }).catch((err) => {

        })
    }

    React.useEffect(() => {
        getChannels();
        //eslint-disable-next-line
    }, [refresh]);

    return(
        <div className="card">
        <div className="cardHeader">Channels</div>
        <div className="cardBody">
          <div className="inputGroup">
            <label htmlFor="channelName">Channel Name</label>
            <input
              type="text"
              name="channelName"
              id="channelName"
              placeholder="Channel Name"
            />
          </div>
        </div>
        <button onClick={postChannel}>Create Channel</button>
        <div className="channels">
          {channels.map((channel) => (
            <div key={channel._id} className="channel">
              <div>{channel.name}</div>
              <Link to={"/channel/" + channel._id}>
                <div className="join">Join</div>
              </Link>
              <Link>
              <div className="delete" onClick={() =>
                 deleteChannel(channel._id)}>Delete</div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
};

export default DashboardPage;
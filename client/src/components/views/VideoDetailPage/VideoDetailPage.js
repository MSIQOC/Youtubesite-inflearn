import React, { useEffect, useState } from 'react'
import { Row, Col, List, Avatar } from 'antd' //창 사이즈 작아지면 다른 영상들이 밑으로 내려가거나 하는거 구현
import Axios from 'axios'
import SideVideo from './Sections/SideVideo'
import Subscribe from './Sections/Subscribe'
import Comment from './Sections/Comment'
function VideoDetailPage(props){

    const videoId = props.match.params.videoId //App.js에서 /video/:videoId라고 했기 때문에 이런 식으로 가져오는게 가능하다.
    const variable = { videoId: videoId }
    
    const [VideoDetail, setVideoDetail] = useState([]) //성공을 하면 state에 저장한다는 뜻으로 사용됨.
    //이것은 어레이가 된다.

    useEffect(() => {

        //useEffect => 돔이 로드 될 때마다 무슨 일을 할 것인지 결정
        //이 다음에 /api/video/getVideoDetail에다가 라우트를 만들어준다. => video.js에 만들어준다.
        Axios.post('/api/video/getVideoDetail', variable)
            .then(response => {
                if(response.data.success) {
                    console.log(response.data)
                    setVideoDetail(response.data.videoDetail)
                } else {
                    alert('비디오 정보를 가져오길 실패했습니다.')
                }
            })

    }, [])

    //여기에서 왜 VideoDetail.writer가 가능한지는 조금 더 고민해봐야 한다. => video.js에서 writer를 populate 해줬기 때문으로 추정.
    if (VideoDetail.writer) {

        const subscribeButton = VideoDetail.writer._id !== localStorage.getItem('userId') && <Subscribe userTo={VideoDetail.writer._id} userFrom={localStorage.getItem('userId')}/>

        return (
            <Row>
                <Col lg={18} xs={24}>
                    <div className="postPage" style={{ width: '100%', padding: '3rem 4rem' }}>
                        <video style={{ width: '100%' }} src={`http://localhost:5000/${VideoDetail.filePath}`} controls></video>

                        <List.Item
                            actions={[ subscribeButton ]}  // userTo와 userFrom이 다른 경우에만 버튼이 나오도록 로직 구성
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={VideoDetail.writer && VideoDetail.writer.image} />} //이렇게 할 수 있는 이유가 writer를 populate 했기 때문이다.
                                title={<a href="https://ant.design">{VideoDetail.title}</a>}
                                description={VideoDetail.description}
                            />
                            <div></div>
                        </List.Item>
                        {/*Comments*/}
                        <Comment /> 
                    </div>
                </Col>
                <Col lg={6} xs={24}>
                    <SideVideo />
                </Col>
            </Row>
        )
    } else {
        return(
            <div>...loading </div>
        )
    }
}

export default VideoDetailPage
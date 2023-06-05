import { Button, ImageList, ImageListItem, Rating, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import StarIcon from '@mui/icons-material/Star';
import CustomedImageListItem from '@components/common/CustomedImageListItem';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';



const ListMeetingReview = () => {
    const { meetingno } = useParams();
    const [meetingReviewList, setMeetingReviewList] = useState();
    const navigate = useNavigate();

    const { data: myData, mutate: mutateMe } = useSWR(
        `${import.meta.env.VITE_SPRING_HOST}/rest/user/login`,
        fetcher
        );

    const [imageLoadingError, setImageLoadingError] = useState(false);

    const handleImageError = useCallback(() => {
      setImageLoadingError(true);
    }, []);


    useEffect(()=>{
        axios
            .get(`${import.meta.env.VITE_SPRING_HOST}/rest/meeting/review/${meetingno}`)
            .then((response)=>{
                console.log(response.data);
                setMeetingReviewList(response.data);
            })
            .catch((error)=>{
                console.log(error);
            });
        },[meetingno]);

        const onClickUpdateMeetingReview = React.useCallback((MouseEvent)=>{
            const { id } = event.target;
            navigate(`/meeting/review/updatereview/reviewno/${id}`);
            },[]);

        const onClickDelete = useCallback(
            
            async (event) => {
                event.preventDefault();
        
                try {
                    const data = {
                        meetingReviewNo: event.target.id
                    };
        
                    console.log(data);
        
                    const response = await axios.delete(`${import.meta.env.VITE_SPRING_HOST}/rest/meeting/review`, {
                        data: data,
                    });
                    navigate(`/meeting/meetingno/${meetingno}`)
                    
                } catch (error) {
                    console.error(error);
                }
            },
            []
        );

    return (
        <Box>
            <Box>
                {meetingReviewList?.map((meetingReview,i)=>(
                    <Box key={i}>
                        <Stack>
                        <Stack 
                        direction="row" 
                        spacing={2}
                        alignItems="center">
                            <img
                                src={`${
                                import.meta.env.VITE_SPRING_HOST
                                }/upload_images/meeting/${meetingReview?.meetingReviewImg}`}
                                style={{ width: '100px', height: '100px' }}
                            />
                        <Stack 
                        spacing={1}
                        direction={'row'}>
                            <Rating 
                            name="read-only" 
                            value={meetingReview.meetingScore} 
                            size='small'
                            readOnly />
                            
                            <Typography variant="subtitle2">{meetingReview.meetingScore}</Typography>
                            </Stack>
                            </Stack>
                            <Typography variant="subtitle2">{meetingReview.meetingReviewContent}</Typography>
                            </Stack>
                    {myData.userNo === meetingReview.meetingReviewerNo && (
                    <>
                    <Button 
                    id={meetingReview.meetingReviewNo}
                    onClick={onClickUpdateMeetingReview}>수정하기</Button>
                    <Button 
                    id={meetingReview.meetingReviewNo}
                    onClick={onClickDelete}>삭제하기</Button>
                    </>
                    )}
                    </Box>
                    
                ))}
            </Box>
        </Box>
    );
};

export default ListMeetingReview;
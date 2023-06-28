import { Box, Stack } from '@mui/system';
import React, { useCallback, useState } from 'react';
import MeetingThumbnail from './MeetingThumnail';
import { Button, Modal, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router';
import useCommunityStore from '@stores/communication/useCommunityStore';
import axios from 'axios';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';

const ListMyMeetingThumnail = ({ meeting }) => {
  const currentDate = new Date();
  const meetingDateTime = new Date(
    `${meeting.meetingDate}T${meeting.meetingStartTime}`
  );
  const { setField } = useCommunityStore();
  const location = useLocation();

  const { data: myData } = useSWR(
    `${import.meta.env.VITE_SPRING_HOST}/rest/user/login`,
    fetcher
    );

  const { mutate: mutateMeeting } = useSWR(
    `${import.meta.env.VITE_SPRING_HOST}/rest/meeting/no/${meeting?.meetingNo}`,
    fetcher
  );

  const { mutate: mutateMeetingLsit } = useSWR(
    `${import.meta.env.VITE_SPRING_HOST}/rest/meeting/list/mymeeting/${myData?.userNo}`,
    fetcher
);

  const isMeetingSuccessTime = currentDate >= meetingDateTime;
  const isMeetingSuccess = meeting.meetingSuccess === 2;
  const isMeetingChatRoot = meeting.meetingState === 1 || 2;

  const isEntryFee = meeting.entryFee != 0;
  const [openModal, setOpenModal] = useState(false);

  const closeModal = useCallback(() => {
    setOpenModal(false);
  }, []);

  const navigate = useNavigate();

  const onClickListMeetingMember = useCallback(() => {
    navigate(`/meeting/member/listmember/meetingno/${meeting.meetingNo}`);
  }, [meeting.meetingNo, navigate]);

  const onClickMeetingSuccess = useCallback(async () => {
    if (isEntryFee) {
      navigate(`/meeting/updatemeetingsuccess/meetingno/${meeting.meetingNo}`);
    } else {
      const data = {
        meetingNo: meeting.meetingNo,
      };

      try {
        const response = await axios.patch(
          `${import.meta.env.VITE_SPRING_HOST}/rest/meeting/meetingsuccess`,
          data
        )
        .then(() => {
          mutateMeetingLsit();
          setOpenModal(true);
          mutateMeeting();
        });

      } catch (error) {
        console.error('Error updating meeting:', error);
      }
    }
  }, [meeting.meetingNo, navigate, isEntryFee, mutateMeeting, mutateMeetingLsit]);

  const onClickChatRoom = useCallback(() => {
    setField('shouldScroll', true);
    setField('isInfiniteScroll', false);
    setField('chatRoomEntryNo', meeting.meetingNo);
    setField('chatType', 2);
    setField('chatRoomLeader', meeting.meetingLeaderNo);
    setField('prevGetGroupChatPath', location.pathname);
    navigate(`/chat/group/message/list`);
  }, [meeting, setField, location, navigate]);

  return (
    <div>
      <Box
        sx={{
          borderRadius: 2,
          p: 2,
          minWidth: 295,
          padding: 1,
          backgroundColor: '#ffffff',
        }}
      >
        <Stack spacing={0.8}>
          <MeetingThumbnail meeting={meeting} />
          <Stack direction={'row'} justifyContent="center" spacing={1.5}>
            {!isMeetingSuccessTime && !isMeetingSuccess && (
              <Button
                variant="outlined"
                sx={{ width: '180px' }}
                onClick={onClickListMeetingMember}
              >
                멤버리스트
              </Button>
            )}
            {isMeetingSuccessTime && !isMeetingSuccess && (
              <Button
                variant="outlined"
                sx={{ width: '180px' }}
                onClick={onClickMeetingSuccess}
              >
                성사하기
              </Button>
            )}
            {isMeetingChatRoot && (
              <Button
                variant="outlined"
                sx={{ width: '180px' }}
                onClick={onClickChatRoom}
              >
                채팅방 입장
              </Button>
            )}
          </Stack>
        </Stack>
      </Box>
      <Modal
        open={openModal}
        onClose={closeModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            p: 4,
            backgroundColor: 'white',
            borderRadius: 2,
            mx: 'auto',
            my: '20%',
            width: '66%',
          }}
        >
          <Typography id="modal-description" sx={{ mt: 2 }}>
            모임이 성사되었습니다.
          </Typography>
          <Button
            onClick={() => {
              closeModal();
            }}
            style={{ alignSelf: 'flex-end', marginTop: 16 }}
            variant="contained"
          >
            확인
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

ListMyMeetingThumnail.propTypes = {
  meeting: PropTypes.object.isRequired,
};

export default ListMyMeetingThumnail;

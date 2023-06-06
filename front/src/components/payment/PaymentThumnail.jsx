import { Box, Stack, ThemeProvider, createTheme } from '@mui/system';
import {
  Avatar,
  AvatarGroup,
  Card,
  Chip,
  ImageListItem,
  Paper,
  Typography,
} from '@mui/material';
import { styled } from '@mui/system';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';

const StyledAvatarGroup = styled(AvatarGroup)({
  '& .MuiAvatar-root': {
    width: 24,
    height: 24,
    fontSize: 12,
  },
});

const PaymentThumnail = ({ payment }) => {
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SPRING_HOST}/rest/meeting/no/${meetingNo}`)
      .then((response) => {
        setMeeting(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const onClickMeeting = useCallback((event) => {
    navigate(`/meeting/meetingno/${meetingNo}`);
  }, []);

  const {
    payNo,
    meetingNo,
    meetingName,
    payTime,
    refundTime,
    entryFee,
    payState,
  } = payment;

  return (
    <Stack
      sx={{
        margin: 1,
        bgcolor: 'background.paper',
        boxShadow: 1,
        borderRadius: 2,
        p: 2,
        minWidth: 300,
        padding: 1.3,
        display: 'flex',
        justifyContent: 'flex-end',
        flexDirection: 'row',
      }}
    >
      <Stack
        sx={{
          width: '33%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <ImageListItem
          sx={{
            maxWidth: '150px',
            maxHeight: '150px',
            minWidth: '150px',
            minHeight: '150px',
          }}
        >
          {meeting?.meetingImg ? (
            <img
              src={`${import.meta.env.VITE_SPRING_HOST}/upload_images/meeting/${
                meeting?.meetingImg
              }`}
              alt='noImg'
              loading='lazy'
              style={{ borderRadius: '7px' }}
              onClick={onClickMeeting}
            />
          ) : (
            <img
              src={`https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=164&h=164&fit=crop&auto=format`}
              style={{ borderRadius: '7px' }}
              onClick={onClickMeeting}
            />
          )}
        </ImageListItem>
      </Stack>
      <Stack
        sx={{
          width: '33%',
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
        }}
      >
        <Stack direction='column'>
          <Stack
            sx={{
              color: 'text.primary',
              fontSize: 15,
              fontWeight: 'medium',
              marginBottom: '2px',
            }}
          >
            결제 번호 {payNo}
          </Stack>
          <Stack
            sx={{
              color: 'text.secondary',
              display: 'inline',
              fontSize: 12,
              marginBottom: '1px',
            }}
          >
            {new Date(payTime).toLocaleString()}
          </Stack>

          <Stack direction='row' spacing={1}>
            <Stack>모 임 명 {meetingName}</Stack>
          </Stack>
          <Stack direction='row' spacing={1}>
            <Stack>참 가 비 {entryFee}원</Stack>
          </Stack>
        </Stack>
        <Stack sx={{ alignItems: 'flex-end' }}>
          {payState === 1 ? (
            '결제완료'
          ) : payState === 2 ? (
            <>
              환불완료
              <Stack
                sx={{
                  color: 'text.secondary',
                  display: 'inline',
                  fontSize: 12,
                }}
              >
                {new Date(refundTime).toLocaleString()}
              </Stack>
            </>
          ) : (
            ''
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

PaymentThumnail.propTypes = {
  payment: PropTypes.shape({
    payNo: PropTypes.string.isRequired,
    meetingNo: PropTypes.number.isRequired,
    meetingName: PropTypes.string.isRequired,
    payTime: PropTypes.number.isRequired,
    refundTime: PropTypes.number.isRequired,
    entryFee: PropTypes.number.isRequired,
    payState: PropTypes.number.isRequired,
  }).isRequired,
};

export default PaymentThumnail;
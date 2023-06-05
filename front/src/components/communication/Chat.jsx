import { FC, useCallback, useState } from 'react';

import { Alert, Avatar, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import PropTypes from 'prop-types';
import { Box, display } from '@mui/system';
import { DateTime } from 'luxon';
import ChatMap from './ChatMap';
import { StaticMap } from 'react-kakao-maps-sdk';
import ChatStaticMap from './ChatStaticMap';
import useChatMapStore from '@stores/communication/useChatMapStore';

const Chat = ({ data }) => {
  const { setField } = useChatMapStore();
  const { data: myData } = useSWR(
    `${import.meta.env.VITE_SPRING_HOST}/rest/user/login`,
    fetcher
  );
  // console.log('!!!', myData);
  // console.log('!!!', data.data);
  const isNotice = data.content_type_no === 101;
  const isMe = myData?.userNo === data.sender_no;
  const messageColor = isMe ? 'black' : 'gray';
  const messageBackColor = isMe ? 'rgba(3, 102, 69, 0.15)' : '#ededed';
  const sendTime = DateTime.fromISO(data.created_at).toLocaleString(
    DateTime.TIME_SIMPLE
  );

  const onClickChatMap = useCallback(() => {
    setField('lat', data.lat);
    setField('lng', data.lng);
    setField('isPost', false);
    setField('locationDrawerOpen', true);
  }, [setField, data]);
  return (
    <Box>
      {isNotice && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography
            sx={{
              backgroundColor: '#ededed',
              padding: '3px',
              margin: '6px',
              borderRadius: '1rem',
            }}
          >
            &nbsp;&nbsp;{data.content}&nbsp;&nbsp;
          </Typography>
        </Box>
      )}
      {!isNotice && (
        <Stack
          direction={'row'}
          justifyContent={isMe ? 'flex-end' : 'flex-start'}
          spacing={1.5}
          sx={{ marginBottom: '10px' }}
        >
          {!isMe && (
            <Avatar
              src={`${
                import.meta.env.VITE_SPRING_HOST
              }/upload_images/user/${data?.Sender.profile_img}`}
              alt="Remy Sharp"
              sx={{ marginLeft: '10px' }}
            />
          )}
          <Stack>
            {!isMe && data.Sender.nick_name}

            <Stack direction={'row'} sx={{ maxWidth: '78vw' }}>
              {isMe && (
                <Stack marginTop="auto">
                  <Typography
                    sx={{
                      fontSize: 12,
                      marginLeft: 'auto',
                      minWidth: '58px',
                      color: 'gray',
                    }}
                  >
                    {sendTime}
                  </Typography>
                  {data?.readCount != 0 && (
                    <Typography
                      color={'primary'}
                      sx={{ fontSize: 12, marginLeft: 'auto', fontWeight: 700 }}
                    >
                      {data.readCount}
                    </Typography>
                  )}
                </Stack>
              )}

              {data.content_type_no == 1 && (
                <Typography
                  component="div"
                  sx={{
                    backgroundColor: `${messageBackColor}`,
                    color: `${messageColor}`,
                    padding: '0.5em',
                    borderRadius: '0.3em',
                    width: 'fit-content',
                    maxWidth: '100%',
                    marginRight: isMe ? '10px' : '3px',
                    marginLeft: isMe ? '3px' : '0px',
                    wordBreak: 'break-all',
                  }}
                >
                  {data.content.split('\n').map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </Typography>
              )}
              {data.content_type_no == 2 && (
                <img
                  src={`${import.meta.env.VITE_EXPRESS_HOST}/uploads/${
                    data.content
                  }`}
                  alt="error"
                  loading="lazy"
                  style={{
                    maxHeight: '200px',
                    maxWidth: '200px',
                    marginLeft: isMe ? '3px' : '0px',
                    marginRight: isMe ? '10px' : '3px',
                  }}
                />
              )}
              {data.content_type_no == 3 && (
                <div onClick={onClickChatMap}>
                  <Box
                    sx={{
                      maxHeight: '300px',
                      maxWidth: '300px',
                      marginLeft: isMe ? '3px' : '0px',
                      marginRight: isMe ? '10px' : '3px',
                      padding: '3px',
                      backgroundColor: messageBackColor,
                      borderRadius: '0.3em',
                    }}
                  >
                    <ChatStaticMap
                      lat={data?.lat}
                      lng={data?.lng}
                      messageNo={data?.message_no}
                    />
                    <Typography sx={{ marginTop: '2px', fontSize: 13 }}>
                      {data.content}
                    </Typography>
                  </Box>
                </div>
              )}

              {!isMe && (
                <Stack marginTop="auto">
                  <Typography sx={{ fontSize: 12, color: 'grey' }}>
                    {sendTime}
                  </Typography>
                  {!isMe && data?.readCount != 0 && (
                    <Typography
                      color={'primary'}
                      sx={{ fontSize: 12, fontWeight: 700 }}
                    >
                      {data.readCount}
                    </Typography>
                  )}
                </Stack>
              )}
            </Stack>
          </Stack>
        </Stack>
      )}
    </Box>
  );
};
Chat.propTypes = {
  data: PropTypes.object,
};
export default Chat;

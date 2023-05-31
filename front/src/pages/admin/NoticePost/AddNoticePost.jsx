import { PhotoCamera } from '@mui/icons-material';
import {
  Button,
  ImageList,
  ImageListItem,
  TextField,
  Typography,
} from '@mui/material';
import { Box, Stack } from '@mui/system';
import { MenuItem } from '@mui/material';

import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';


const useInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const clear = () => {
    setValue('');
  };

  return [value, onChange, clear];
};

const AddNoticePost = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [noticePostTitle, onChangeNoticePostTitle, clearNoticePostTitle] = useInput('');
  const [noticePostText, onChangeNoticePostText, clearNoticePostText] = useInput('');
  const [noticePostCategory, setNoticePostCategoryNo] = useState(0); // 카테고리 선택 상태값
  const [userNo, setUserNo] = useState(''); // 사용자 번호 상태값

  const handleImageError = useCallback(() => {
    // 이미지 로딩 오류 처리를 위한 함수
  }, []);

  const submitNoticePost = useCallback(() => {
    const formData = new FormData();

    formData.append('file', selectedFile);
    formData.append('noticePostCategory', noticePostCategory);
    formData.append('noticePostTitle', noticePostTitle);
    formData.append('noticePostText', noticePostText);
    formData.append('userNo', userNo);
    console.log(userNo, "this is formData mofucker")
    axios.post(`http://${import.meta.env.VITE_SPRING_HOST}/rest/admin/addNoticePost`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((response) => {
        console.log(response.data);
        navigate('/');
      })
      .catch((error) => {
        console.error(error);
      });
  }, [selectedFile, noticePostCategory, noticePostTitle, noticePostText, userNo, navigate]);

  return (
    <Box sx={{ marginTop: '64px', marginLeft: '10px', marginRight: '10px' }}>
      <Stack spacing={2.5}>
        <TextField
          label="제목"
          value={noticePostTitle}
          onChange={onChangeNoticePostTitle}
        />
        <TextField
          label="내용"
          multiline
          rows={4}
          value={noticePostText}
          onChange={onChangeNoticePostText}
        />
        <TextField
          select
          label="카테고리"
          value={noticePostCategory}
          onChange={(e) => setNoticePostCategoryNo(Number(e.target.value))}
        >
          <MenuItem value={0}>공지사항</MenuItem>
          <MenuItem value={1}>이벤트</MenuItem>
          <MenuItem value={2}>QnA</MenuItem>
        </TextField>
        <TextField
          label="사용자 번호"
          value={userNo}
          onChange={(e) => setUserNo(e.target.value)}
        />
        <Box>
          <ImageList
            sx={{ width: 320, height: 140 }}
            cols={3}
            rowHeight={140}
          >
            <ImageListItem>
              <Stack spacing={0.5}>
                {selectedImage ? (
                  <img
                    style={{
                      minWidth: '100px',
                      minHeight: '100px',
                      maxWidth: '100px',
                      maxHeight: '100px',
                    }}
                    src={selectedImage}
                  />
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'grey',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '100px',
                      minHeight: '100px',
                      maxWidth: '100px',
                      maxHeight: '100px',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '1.2rem',
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    >
                      No Img
                    </Typography>
                  </Box>
                )}
                <Button
                  variant="outlined"
                  startIcon={<PhotoCamera />}
                  color="primary"
                  aria-label="upload picture"
                  component="label"
                  sx={{ maxWidth: '100px' }}
                >
                  이미지 업로드
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={(event) => {
                      const file = event.target.files[0];
                      setSelectedFile(file);
                      setSelectedImage(URL.createObjectURL(file));
                    }}
                  />
                </Button>
              </Stack>
            </ImageListItem>
          </ImageList>
        </Box>
        <Button variant="contained" onClick={submitNoticePost}>
          게시글 작성
        </Button>
      </Stack>
    </Box>
  );
};

export default AddNoticePost;
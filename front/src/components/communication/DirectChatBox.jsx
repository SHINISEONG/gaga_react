import {
  FormEvent,
  useCallback,
  FC,
  ChangeEvent,
  KeyboardEvent,
  useState,
} from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import LeftDrawer from './LeftDrawer';
import PropTypes from 'prop-types';
import AddIcon from '@mui/icons-material/Add';
import { Box } from '@mui/system';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios';
import useInputOrigin from '@hooks/common/useInputOrigin';

const DirectChatBox = ({ senderNo, receiverNo, mutateDirectMessages }) => {
  const [chat, onChangeChat, setChat] = useInputOrigin('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const [uploadChatImgDialogOpen, setUploadChatImgDialogOpen] = useState(false);

  const open = Boolean(anchorEl);

  const onClickPictureMenu = useCallback(() => {
    setUploadChatImgDialogOpen(true);
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUploadChatImgDialogClose = useCallback(() => {
    setAnchorEl(null);
    setUploadChatImgDialogOpen(false);
  }, []);
  const onChangeChatImg = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setSelectedImage(URL.createObjectURL(file));
  };

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (chat?.trim()) {
        axios
          .post(
            `http://${
              import.meta.env.VITE_EXPRESS_HOST
            }/rest/chat/direct/message`,
            {
              senderNo: senderNo,
              receiverNo: receiverNo,
              content: chat,
              contentTypeNo: 1,
            },
            { withCredentials: true }
          )
          .then(() => {
            mutateDirectMessages();
            setChat('');
          })
          .catch((error) => {
            console.dir(error);
          });
      }
    },
    [chat, setChat, mutateDirectMessages, senderNo, receiverNo]
  );

  // const onKeydownChat = useCallback(
  //   (e) => {
  //     if (e.key === 'Enter') {
  //       // if (!e.shiftKey) {
  //       e.preventDefault();
  //       onSubmitForm(e);
  //       // }
  //     }
  //   },
  //   [onSubmitForm]
  // );

  const onClickChat = useCallback(
    (e) => {
      console.log(e);

      e.preventDefault();
      onSubmitForm(e);
    },
    [onSubmitForm]
  );

  const submitUploadChatImgDialog = useCallback(() => {
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('senderNo', senderNo);
    formData.append('receiverNo', receiverNo);

    axios
      .post(
        `http://${import.meta.env.VITE_EXPRESS_HOST}/rest/chat/
         direct/image`,
        formData,
        { withCredentials: true }
      )
      .then(() => {
        setUploadChatImgDialogOpen(false);
        setAnchorEl(null);
      })
      .catch((error) => {
        console.dir(error);
      })
      .finally(() => {
        setUploadChatImgDialogOpen(false);
        setAnchorEl(null);
      });
  }, [selectedFile, setUploadChatImgDialogOpen, senderNo, receiverNo]);

  return (
    <Box>
      <Stack
        spacing={0}
        direction="row"
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
      >
        <Button
          variant="contained"
          color="info"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          sx={{ borderRadius: 0 }}
        >
          <AddIcon fontSize="large" />
        </Button>
        <TextField
          id="outlined-multiline-flexible"
          multiline
          autoFocus
          maxRows={4}
          fullWidth
          variant="filled"
          value={chat}
          onChange={onChangeChat}
          // onKeyDown={onKeydownChat}
          sx={{ borderRadius: 0 }}
        />

        <Button
          sx={{ borderRadius: 0 }}
          variant="contained"
          onClick={onClickChat}
        >
          <SendIcon fontSize="large" />
        </Button>
      </Stack>
      {/* ---------------------부가 전송 메뉴------------------------------------ */}
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={onClickPictureMenu}>
          <Button
            startIcon={<InsertPhotoIcon />}
            color="primary"
            aria-label="upload picture"
            component="label"
          >
            사진
            <input
              hidden
              accept="image/*"
              type="file"
              id="file"
              name="file"
              onChange={onChangeChatImg}
            />
          </Button>
        </MenuItem>

        <MenuItem onClick={handleClose}>
          <Button
            startIcon={<LocationOnIcon />}
            color="primary"
            aria-label="upload picture"
            component="label"
          >
            위치
          </Button>
        </MenuItem>

        <MenuItem onClick={handleClose}>
          <Button
            startIcon={<ClearIcon />}
            color="primary"
            aria-label="upload picture"
            component="label"
          >
            닫기
          </Button>
        </MenuItem>
      </Menu>
      {/* --------------------------- 다이얼로그 ------------------------------------------- */}
      <Dialog
        open={uploadChatImgDialogOpen}
        onClose={handleUploadChatImgDialogClose}
      >
        <DialogTitle>사진 미리보기</DialogTitle>
        <DialogContent
          sx={{
            justifyContent: 'center',
            display: 'flex',
          }}
        >
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="Selected Image Preview"
              loading="lazy"
              style={{ maxWidth: '200px', maxHeight: '200px' }}
            />
          ) : (
            <Box
              sx={{
                minWidth: '200px',
                minHeight: '200px',
                width: '100%',
                height: '100%',
                backgroundColor: 'grey',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                sx={{
                  fontSize: '1.2rem',
                  color: 'white',
                  fontWeight: 'bold',
                }}
              >
                선택된 사진이 없습니다.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUploadChatImgDialogClose}>취소</Button>
          <Button onClick={submitUploadChatImgDialog}>전송</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

DirectChatBox.propTypes = {
  senderNo: PropTypes.number,
  receiverNo: PropTypes.number,
  mutateDirectMessages: PropTypes.func,
};

export default DirectChatBox;
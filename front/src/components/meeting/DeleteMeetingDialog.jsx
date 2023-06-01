import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import axios from 'axios';
import React, { useCallback } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router';

const DeleteMeetingDialog = ({ open, setOpen }) => {

    const { meetingno } = useParams();


    const handleClose = () => {
        setOpen(false);
      };

      const navigate = useNavigate();


      const onClickDelete = useCallback(
        (event) => {
            event.preventDefault();

            try {
            const data = {
              meetingNo: parseInt(meetingno)
            };

            console.log(data);

            const response = axios.patch(`http://${import.meta.env.VITE_SPRING_HOST}/rest/meeting/delete`, 
                data);

            navigate(`/`);
                
            } catch (error) {
                console.error(error);
            }
        },
        [meetingno]
    );

    return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>모임을 삭제하시겠습니까?</DialogTitle>
        <DialogActions>
          <Button
          variant="contained"
          onClick={handleClose}>취소</Button>
          <Button 
          variant="contained"
          onClick={onClickDelete}>삭제하기</Button>
        </DialogActions>
      </Dialog>
    </div>
    );
};

export default DeleteMeetingDialog;
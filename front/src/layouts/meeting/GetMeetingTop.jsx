import { AppBar, Button, Divider, IconButton, List, ListItem, SwipeableDrawer, Toolbar, Typography } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import React, { useCallback, useState } from 'react';
import Container from '@mui/material/Container';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import { useNavigate, useParams } from 'react-router';
import { Box } from '@mui/system';
import axios from 'axios';
import DeleteMeetingDialog from '@components/meeting/DeleteMeetingDialog';

const GetMeetingTop = () => {
    const { meetingno } = useParams();

  const navigate = useNavigate();


  const [leaderMenuOpen, setLeaderMenuOpen] = useState(false);

  const onClickLeaderMenu = useCallback(() => {
    // navigate('/settings');
    setLeaderMenuOpen(true);
  }, []);

const toggleLeaderMenuOpen = useCallback(
    (state) => () => {
        setLeaderMenuOpen(state);
    },
    []
  );

const onClickUpdate = useCallback((MouseEvent)=>{
  navigate(`/meeting/updatemeeting/${ meetingno }`);
},[]);

const [deleteMeetingDialogOpen, setDeleteMeetingDialogOpen] =
useState(false);


const onClickDeleteSelect = useCallback(() => {
  setDeleteMeetingDialogOpen(true);
}, []);

const onClickDelete = useCallback(
  async (event) => {
      event.preventDefault();

      try {
      const data = {
          meetingNo: meetingno
      };

      console.log(data);

      const response = await axios.delete(`http://${import.meta.env.VITE_SPRING_HOST}/rest/meeting`, {
          data: data,
      });

      navigate(`/`);
          
      } catch (error) {
          console.error(error);
      }
  },
  []
);

  return (
    <>
    <AppBar position="fixed" color="secondary" elevation={0} sx={{ height: '50px' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}> 
          <IconButton
            onClick={() => {
              navigate(-1);
            }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>

          <IconButton>
            <MoreHorizIcon onClick={onClickLeaderMenu}/>
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>

    <SwipeableDrawer
        anchor="bottom"
        open={leaderMenuOpen}
        onClose={toggleLeaderMenuOpen(false)}
        onOpen={toggleLeaderMenuOpen(true)}
      >
        <Box sx={{ minWidth: '300px' }}>
          <List>
            <ListItem>
              <Button 
              variant="contained"
              onClick={onClickUpdate}>수정하기</Button>
            </ListItem>
            <Divider />
            <ListItem>
              <Button 
              variant="contained"
              onClick={onClickDeleteSelect}>삭제하기</Button>
            </ListItem>
          </List>
        </Box>
      </SwipeableDrawer>

      <DeleteMeetingDialog
        open={deleteMeetingDialogOpen}
        setOpen={setDeleteMeetingDialogOpen}
      />

    </>
    
  );
};

export default GetMeetingTop;
import {
  Button,
  Grid,
  Modal,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { Box, Stack, margin } from '@mui/system';
import React, { useCallback, useEffect, useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import useMeetingFormStore from '@hooks/meeting/useMeetingFormStore';
import useClubFormStore from '@hooks/club/useClubFormStore';
import fetcher from '@utils/fetcher';
import useSWR from 'swr';
import { useNavigate } from 'react-router';
import axios from 'axios';

const AddClubMaxMember = () => {
  const { data: myData, mutate: mutateMe } = useSWR(
    `${import.meta.env.VITE_SPRING_HOST}/rest/user/login`,
    fetcher
  );

  const {
    mainCategoryNo,
    filterTag,
    clubName,
    clubIntro,
    clubRegion,
    filterGender,
    filterMinAge,
    filterMaxAge,
    clubMaxMemberNo,
    file,
    setField,
    onChangeField,
    reset,
  } = useClubFormStore();

  const [openModal, setOpenModal] = useState(false);
  const closeModal = () => {
    setOpenModal(false);
    navigate('/community/profile/mine');
  };

  const isDecreaseDisabled = clubMaxMemberNo === 3;
  const isIncreaseDisabled = clubMaxMemberNo === 99;

  const handleDecrease = () => {
    if (clubMaxMemberNo > 3) {
      setField('clubMaxMemberNo', clubMaxMemberNo - 1);
    }
  };

  const handleIncrease = () => {
    if (clubMaxMemberNo < 99) {
      setField('clubMaxMemberNo', clubMaxMemberNo + 1);
    }
  };

  useEffect(() => {
    if (clubMaxMemberNo === null) {
      setField('clubMaxMemberNo', 3);
    }
  }, [clubMaxMemberNo, setField]);

  const navigate = useNavigate();
  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      try {
        const formData = new FormData();

        formData.append('file', file);
        formData.append('mainCategoryNo', mainCategoryNo);
        formData.append('filterTag', filterTag);
        formData.append('clubName', clubName);
        formData.append('clubIntro', clubIntro);
        formData.append('clubRegion', clubRegion);
        formData.append('filterGender', filterGender);
        formData.append('filterMinAge', filterMinAge);
        formData.append('filterMaxAge', filterMaxAge);
        formData.append('clubMaxMemberNo', clubMaxMemberNo);
        formData.append('clubLeaderNo', myData.userNo);

        const response = await axios.post(
          `${import.meta.env.VITE_SPRING_HOST}/rest/club`,
          formData
        );

        reset();

        setOpenModal(true);

        console.log('생기는 클럽 번호 정보', response.data.clubNo);

        console.log('생기는 클럽 정보', response.data);
      } catch (error) {
        console.error(error);
      }
    },
    [clubMaxMemberNo]
  );

  return (
    <Box sx={{ margin: '10px' }}>
      <h4>몇 명과 함께 할까요?</h4>
      <h5 style={{ color: 'gray' }}>
        본인을 포함한 총 참여 인원 수를 알려주세요.
      </h5>
      <Stack
        direction='row'
        alignItems='center'
        spacing={8}
        justifyContent='center'
        margin={7}
      >
        <RemoveCircleIcon
          onClick={handleDecrease}
          sx={{ color: isDecreaseDisabled ? 'lightgray' : 'inherit' }}
        />
        <Typography variant='inherit' sx={{ fontSize: 16 }}>
          {clubMaxMemberNo}
        </Typography>
        <AddCircleIcon
          onClick={handleIncrease}
          sx={{ color: isIncreaseDisabled ? 'lightgray' : 'inherit' }}
        />
      </Stack>
      <Paper variant='outlined' sx={{ margin: '5px', padding: '10px' }}>
        <Typography style={{ color: 'gray' }} sx={{ fontSize: 13 }}>
          클럽 인원 안내
        </Typography>
        <Typography style={{ color: 'gray' }} sx={{ fontSize: 13 }}>
          3~100 명
        </Typography>
      </Paper>
      <Stack
        spacing={0}
        direction='row'
        justifyContent='center'
        alignItems='center'
        sx={{ position: 'fixed', bottom: 5, left: 0, right: 0 }}
      >
        <Button
          variant='contained'
          sx={{ width: '85vw', borderRadius: '50px' }}
          onClick={handleSubmit}
        >
          생성하기
        </Button>
        <>
          <Modal
            open={openModal}
            onClose={closeModal}
            aria-labelledby='modal-title'
            aria-describedby='modal-description'
          >
            <Box
              sx={{
                p: 4,
                backgroundColor: 'white',
                borderRadius: 2,
                mx: 'auto',
                my: '20%',
                width: '50%',
              }}
            >
              <Typography id='modal-title' variant='h6' component='h2'>
                알림
              </Typography>
              <Typography id='modal-description' sx={{ mt: 2 }}>
                클럽 생성이 완료되었습니다.
              </Typography>
              <Button
                onClick={() => {
                  closeModal();
                }}
                style={{ alignSelf: 'flex-end', marginTop: 16 }}
                variant='contained'
              >
                확인
              </Button>
            </Box>
          </Modal>
        </>
      </Stack>
    </Box>
  );
};

export default AddClubMaxMember;

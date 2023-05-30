import { useParams, useNavigate } from "react-router";
import fetcher from "@utils/fetcher";
import useSWR from "swr";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Box } from "@mui/system";
import { Button } from "@mui/material";
import ListGroupMember from "@components/user/ListGroupMember";

const ListMyClub = () => {
  const { userno } = useParams();
  const [clubList, setClubList] = useState();
  const navigate = useNavigate();

  const { data: myData, mutate: mutateMe } = useSWR(
    `http://${import.meta.env.VITE_SPRING_HOST}/rest/user/login`,
    fetcher
  );

  useEffect(() => {
    axios
      .get(
        `http://${import.meta.env.VITE_SPRING_HOST}/rest/club/list/join/${
          myData?.userNo
        }`
      )
      .then((response) => {
        console.log(response.data);
        setClubList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const onClickClub = useCallback((event) => {
    const { id } = event.target;
    navigate(`/club/no/${id}`);
  }, []);

  const onClickListClubMember = useCallback((event) => {
    const { id } = event.target;
    navigate(`/user/memberlist`);
  }, []);

  return (
    <Box>
      <Box>
        {clubList?.map((club, i) => (
          <Box key={i}>
            <h5>{club.clubName}</h5>
            <h5>{club.state}</h5>
            <Button id={club.clubNo} onClick={onClickClub}>
              클럽정보
            </Button>
            <Button id={club.clubNo} onClick={onClickListClubMember}>
              클럽멤버
            </Button>
            <ListGroupMember />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ListMyClub;
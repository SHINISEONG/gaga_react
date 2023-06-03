import React, { useState, useCallback} from "react";
import axios from "axios";
import { Button, TextField } from "@mui/material";
import fetcher from "@utils/fetcher";
import CommonTop from "@layouts/common/CommonTop";
import { Typography } from "@mui/material";
import useSWR from "swr";

function DeleteUser() {
  const [password, setPassword] = useState("");
  const [outReason, setOutReason] = useState("");
  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false);
  const [isConfirmationDisplayed, setIsConfirmationDisplayed] = useState(false);

  const { data: myData, error } = useSWR(
    `http://${import.meta.env.VITE_SPRING_HOST}/rest/user/login`,
    fetcher
  );
  // const onClickLogOut = useCallback(async () => {
  //   await axios
  //     .delete(`http://${import.meta.env.VITE_SPRING_HOST}/rest/user/logout`, {
  //       withCredentials: true,
  //     })
  //     .then(() => {
  //       mutateMe();
  //     });
  // }, [mutateMe]);

  if (error) return <div>로그인 정보를 불러오는데 실패했습니다.</div>;
  if (!myData) return <div>데이터 로딩 중...</div>;

  const confirmPassword = () => {
    if (password === myData.password) {
      setIsPasswordConfirmed(true);
    } else {
      setIsPasswordConfirmed(false);
      alert("비밀번호가 일치하지 않습니다.");
    }
  };

  const deleteUser = async () => {
    console.log("탈퇴사유가 안감?"+outReason);
    if (!isPasswordConfirmed) {
      alert("비밀번호를 확인해야 합니다.");
      return;
    }
    const confirmation = window.confirm("정말로 회원 탈퇴하시겠습니까?");
    if (confirmation) {
      try {
        const updatedUser = {
          ...myData,
          outReason,
        };
        const response = await fetch(
          `http://${import.meta.env.VITE_SPRING_HOST}/rest/user/deleteUser`,
          {
                  method: "POST",
                  headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify( updatedUser),
          }
        );

        if (!response.ok) {
          throw new Error("서버 에러");
        }

        // 로그아웃 요청
      const logoutResponse = await fetch(
        `http://${import.meta.env.VITE_SPRING_HOST}/rest/user/logout`,
        { method: "DELETE" }
      );
      
      if (!logoutResponse.ok) {
        throw new Error("로그아웃 실패");
      }

      // 페이지 이동
      window.location.href = "/"; // 이 경로를 메인 페이지 경로로 변경해주세요.


        alert("회원 탈퇴가 완료되었습니다.");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleOutReasonChange = (e) => {
    setOutReason(e.target.value);
    console.log(outReason);
  };

  return (
    <div>
      <CommonTop />
      <Typography
        variant="body1"
        style={{ marginTop: "63px", paddingLeft: "12px", paddingRight: "12px" }}
      >
        Gaga 서비스를 이용해 주셔서 감사드립니다.
        <br />
        회원 탈퇴로 인해 아쉽게 생각하지만, 회원님의 의견을 소중히 받아들이고
        서비스 향상에 반영하겠습니다. 언제든지 다시 Gaga에 가입해주실 경우,
        언제든지 환영합니다.
        <br />
        <br />
        탈퇴사유를 입력해주시면 참고하여
        <br />
        서비스 개선에 참고하겠습니다.<br /><br />
        회원님의 정보는 탈퇴시 즉시 삭제되며,
        <br />
        <b>현재 비밀번호 확인후 탈퇴 가능합니다.</b>
        <br />
        <br />

      </Typography>
      <TextField
        label="비밀번호"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />
      <Button variant="contained" onClick={confirmPassword}>
        확인
      </Button>
      <TextField
            label="탈퇴 사유"
            value={outReason}
            onChange={handleOutReasonChange}
            multiline
            rows={4}
            style={{ marginTop: "16px", width: "99%" }}
          />

      {isPasswordConfirmed && (
        <>
          <Typography>비밀번호가 확인되었습니다.</Typography>
          
          <Button variant="contained" onClick={deleteUser}>
            회원 탈퇴
          </Button>
        </>
      )}
    </div>
  );
}

export default DeleteUser;
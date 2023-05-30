import CommonTop from '@layouts/common/CommonTop';
import { ButtonBase, Divider, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import fetcher from '@utils/fetcher';
import React, { useCallback } from 'react';
import useSWR from 'swr';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { DateTime } from 'luxon';
const ListReport = () => {
  const { data: myData, mutate: mutateMe } = useSWR(
    `http://${import.meta.env.VITE_SPRING_HOST}/rest/user/login`,
    fetcher
  );

  const { data: reportListData, mutate: mutateReportList } = useSWR(
    `http://${
      import.meta.env.VITE_SPRING_HOST
    }/rest/community/report/list/userno/${myData?.userNo}/role/${myData?.role}`,
    fetcher
  );

  const onClickReport = useCallback((e) => {
    console.log(e.currentTarget.dataset.value);
  }, []);
  return (
    <div>
      <CommonTop pageName="신고 목록 조회" />
      <TableContainer>
        <Table
          sx={{
            minWidth: '70vw',
            maxWidth: '90vw',
            marginLeft: '10px',
            marginRight: '5px',
          }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                피신고자
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                신고일자
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportListData?.map((report, i) => {
              const formattedDate = DateTime.fromISO(
                report.reportDate
              ).toFormat('yyyy년 MM월 dd일');

              return (
                <TableRow
                  key={i}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  onClick={onClickReport}
                  data-value={report.reportNo}
                >
                  <TableCell align="center" component="th" scope="row">
                    {report.reportedId}
                  </TableCell>
                  <TableCell align="center">{formattedDate}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ListReport;
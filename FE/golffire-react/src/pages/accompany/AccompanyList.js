import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { getNameById } from "../golffield/ParseGolfId";
import AccompanyBox from "./AccompanyBox";

import ProfileImg from "../../assets/source/imgs/favicon.png";
import flagred from "../../assets/source/icons/flag-red.png";
import flagwhite from "../../assets/source/icons/flag-white.png";
import flagblack from "../../assets/source/icons/flag-black.png";
import flagall from "../../assets/source/icons/flag-all.png";

import { MdSportsGolf } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import { GrClose } from "react-icons/gr";
import { BsFillPersonFill } from 'react-icons/bs';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { SearchIcon } from "@chakra-ui/icons";

// Redux
import { useSelector } from "react-redux";

import axios from "axios";

function AccompanyList() {
  // 사용자 정보(userId)로 로그인 여부 판단
  const userId = useSelector((state) => state.userInfoFeatrue.userId);

  const pageSize = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 페이징 컨트롤 인식
  const handlePageChange = (pageNumber) => {
    getCompanionList(searchValue, pageNumber);
  };

  const [companionList, setCompanionList] = useState([]);

  // 처음 화면이 로딩 될 때 동행 리스트 정보 호출
  useEffect(() => {
    getCompanionList("", 1);
  }, []);

  const getCompanionList = (searchValue, currentPage) => {
    const apiUrl = process.env.REACT_APP_SERVER_URL + "/api/companion/search?page=" + (currentPage - 1) + "&size=" + pageSize;

    setSearchValue(searchValue);
    setCurrentPage(currentPage);

    const companionSearchRequest = {
      title: searchFilter == 'title' && searchValue.trim() != "" ? searchValue : null,
      memberNickname: searchFilter == 'author' && searchValue.trim() != "" ? searchValue : null,
      description: searchFilter == 'titleContent' && searchValue.trim() != "" ? searchValue : null,
      teeBox: searchTeeBox,
      followerId: selectedFollow ? userId : null
    };

    console.log("검색:");
    console.log(companionSearchRequest);

    axios.post(apiUrl, companionSearchRequest)
      .then((response) => {
        console.log(response);

        setCompanionList(response.data.companionList);
        setTotalPages(response.data.totalPages);
      });
  };

  // 검색을 위한 변수
  const [searchValue, setSearchValue] = useState("");
  const [searchFilter, setSearchFilter] = useState("title");
  const [searchTeeBox, setSearchTeeBox] = useState("NONE");
  const [selectedFollow, setSelectedFollow] = useState(false);

  useEffect(() => {
    setSearchValue("");
  }, [searchFilter]);

  useEffect(() => {
    setSearchFilter("title");
    getCompanionList("", 1);
  }, [selectedFollow]);

  useEffect(() => {
    setSearchFilter("title");
    getCompanionList("", 1);
  }, [searchTeeBox]);

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
    // 검색 기능을 추가하고 원하는 작업을 수행할 수 있습니다.
  };

  const handleFilterChange = (event) => {
    setSearchFilter(event.target.value);
  };

  const handleTeeBoxChange = (searchTeeBox) => {
    setSearchTeeBox(searchTeeBox);
  };

  const handleSearchClick = () => {
    // 검색 버튼을 클릭할 때 서버로 검색 필터와 검색 값 전송하는 로직을 추가합니다.
    if (searchValue.trim() !== "") {
      const searchData = {
        filter: searchFilter,
        value: searchValue,
      };

      // 여기서 searchData를 서버로 전송하는 API 호출 등의 작업을 수행할 수 있습니다.
      console.log("Sending searchData to server:", searchData);
    }
  };
  const [switchValue, setSwitchValue] = useState(false);

  const handleSwitchChange = () => {
    setSwitchValue(!switchValue);
    // 필터 기능을 추가하고 원하는 작업을 수행할 수 있습니다.
  };

  // 팔로잉 라디오 버튼 함수
  const handleFollowChange = () => {
    setSelectedFollow(!selectedFollow);
  }

  // 이 위는 검색 필터 기능들
  // 이 아래는 리스트 관련 기능들
  const [accompanyList, setAccompanyList] = useState([{}, {}, {}, {}, {}, {}]);

  // 동행 모집 리스트
  const accompanyData = [
    { id: 1, title: "제목 1", authorId: "123456", authorNickname: "김싸피가 먹는 고구마", tee: "red", placeId: 1, date: "2023-09-30 13:00" },
    { id: 2, title: "제목 2", authorId: "456789", authorNickname: "황싸피", tee: "white", placeId: 4, date: "2023.09.30 13:00" },
    { id: 3, title: "제목 3", authorId: "789777", authorNickname: "한싸피", tee: "all", placeId: 5, date: "2023.09.30 13:00" },
    { id: 4, title: "제목 4", authorId: "123123", authorNickname: "함싸피", tee: "black", placeId: 89, date: "2024.09.30 13:00" },
    { id: 5, title: "제목 5", authorId: "999999", authorNickname: "문싸피", tee: "white", placeId: 210, date: "2023.09.30 18:00" },
    { id: 6, title: "제목 6", authorId: "333333", authorNickname: "최싸피", tee: "red", placeId: 61, date: "2023.09.30 10:00" },
  ];

  // 이미지 파일 경로를 객체로 관리
  const teeMap = {
    RED: flagred,
    WHITE: flagwhite,
    BLACK: flagblack,
    NONE: flagall,
  }

  const [isSelected, setIsSelected] = useState(false); // 글 선택 여부
  const [selectedId, setSelectedId] = useState(null); // 선택된 글 번호
  const [selectedContent, setSelectedContent] = useState(null); // 선택된 글 내용

  const handleSelectButtonClick = (id) => {
    if (isSelected && selectedId && selectedId === id) {
      setIsSelected(false);
      setSelectedId(null);
    } else {
      getSelectedContent(id);
    }
  };

  const getSelectedContent = (id) => {
    const apiUrl = process.env.REACT_APP_SERVER_URL + "/api/companion/" + id;

    axios.get(apiUrl).then((response) => {
      setSelectedContent(response.data);

      console.log("동행 모집 한 건 조회");
      console.log(response);

      setIsSelected(true);
      setSelectedId(id);
    });
  };

  const dateFormat = (input) => {
    const date = new Date(input);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분`;
  };

  return (
    <div className="list-container">
      <div className={isSelected ? 'list-container-list-selected' : 'list-container-list-unselected'}>
        <div className="list-head">
          <Link to="/createaccompany">
            <div className="head-create-button bg-accompany">+ 모집하기</div>
          </Link>

          <div className="search-container">
            {/* 검색창 */}
            {searchFilter === "tee" ? (
              <div className = "search-tee-box-container">
                <div className = "search-tee-items">
                <div className="search-tee-item">
                  <img src={flagred} alt="레드 티 박스"
                      onClick={() => handleTeeBoxChange('RED')}
                      className={`search-tee-img${teeMap[searchTeeBox] === 'flagred' ? '-selected' : ''}`} />
                </div>
                <div className="search-tee-item">
                  <img src={flagwhite} alt="화이트 티 박스"
                      onClick={() => handleTeeBoxChange('WHITE')}
                      className={`search-tee-img${teeMap[searchTeeBox] === 'flagwhite' ? '-selected' : ''}`} />
                </div>
                <div className="search-tee-item">
                  <img src={flagblack} alt="블랙 티 박스"
                      onClick={() => handleTeeBoxChange('BLACK')}
                      className={`search-tee-img${teeMap[searchTeeBox] === 'flagblack' ? '-selected' : ''}`} />
                </div>
                <div className="search-tee-item">
                  <img src={flagall} alt="모든 티 박스"
                      onClick={() => handleTeeBoxChange('NONE')}
                      className={`search-tee-img${teeMap[searchTeeBox] === 'flagall' ? '-selected' : ''}`} />
                  </div>  
                </div>
              </div>
            ) : (
              <div className="search-input-container">
                <input
                  className="search-input-box"
                  type="text"
                  value={searchValue}
                  onChange={handleInputChange}
                  placeholder="검색어를 입력하세요"
                />
                <button id="search-input-icon" onClick={handleSearchClick}>
                  <SearchIcon boxSize={6} color="#8D8F98" />
                </button>
              </div>
            )}


            {/* 검색 필터 */}
            <select
              id="searchFilter"
              className="search-filter"
              value={searchFilter}
              onChange={handleFilterChange}
            >
              <option value="title">제목</option>
              <option value="author">작성자</option>
              <option value="titleContent">제목 및 내용</option>
              <option value="tee">티 박스</option>
            </select>

          </div>
          <div className="checkbox-div">
            <label class="switch" value={selectedFollow} onChange={handleFollowChange}>
              <input type="checkbox" />
              <span class="slider round"></span>
            </label>
            <div>
              팔로잉
            </div>
          </div>

        </div>
        <div className={isSelected ? 'list-body-selected' : 'list-body-unselected'}>
          {companionList.map((accompanyRoom) => (
            <AccompanyBox
              key={accompanyRoom.id}
              id={accompanyRoom.id}
              title={accompanyRoom.title}
              tee={teeMap[accompanyRoom.teeBox]}
              author={accompanyRoom.memberNickname}
              place={getNameById(accompanyRoom.field)}
              date={accompanyRoom.teeUptime}
              handleSelectButtonClick={handleSelectButtonClick}
              dateFormat={dateFormat}
            />
          ))}
        </div>

        <div className="list-footer">
          <button
            className="control-arrow"
            disabled={currentPage == 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <IoIosArrowBack className="option-title-icon" />
          </button>
          <div id="control-num">{currentPage}</div>
          <button
            className="control-arrow"
            disabled={currentPage == totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <IoIosArrowForward className="option-title-icon" />
          </button>
        </div>
        
      </div>
      {/* 배경 div */}
      <div className="list-background-div bg-accompany"></div>

      {/* 선택 시 나타나는 정보 */}
      {isSelected && selectedId && (
        <div className="selected-container">
          <div className="selected-container-head">
            <div className="selected-container-title">
              <div className="title-text">
                {selectedContent.title}
              </div>
              <h1 className="cursor-able"><GrClose size={30} onClick={() => setIsSelected(false)} /></h1>
            </div>
            <div className="box-author-position">
              <div className="box-author">
                <img className="profile-icon" src={ProfileImg} alt={`$author님`} />
                {selectedContent.memberNickname}
              </div>
            </div>
          </div>
          <div className="selected-container-body">
            <div className="accompany-textarea">{selectedContent.description}</div>
            <div className="selected-container-info">
              <FaMapMarkerAlt className="react-icon" color="red" />
              <div className="info-text-left">
                {getNameById(selectedContent.field)}
              </div>
              <div className="info-text-right">
                <img className="profile-icon" src={teeMap[selectedContent.teeBox]}></img>
              </div>
            </div>
            <div className="selected-container-info">
              <MdSportsGolf className="react-icon" />
              <div className="info-text-left">
                {dateFormat(selectedContent.teeUpTime)}
              </div>
              <div className="info-text-right">
                <BsFillPersonFill className="react-icon" />
                {selectedContent.companionUserCount} / {selectedContent.capacity}
              </div>
            </div>
          </div>
          <div className="selected-container-footer">
            <Link to={`/accompanyroom/${selectedContent.id}`}>
              <button className="button accompany-button bg-accompany">참여하기</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccompanyList;

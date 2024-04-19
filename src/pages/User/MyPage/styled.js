import { styled } from "styled-components";

export const Container = styled.div`
  background: #f1f1f1;
  padding: 80px 0;
`;

export const Wrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

export const Content = styled.div`
  display: flex;
  justify-content: center;
  gap: 35px;

  @media screen and (max-width: 1080px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const Items = styled.div`
  padding: 20px;
  border-radius: 10px;
  box-shadow: 3px 2px 12px rgba(0, 0, 0, 0.2);
  background: #fff;

  &.left {
    width: 30%;
    height: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .l-title {
      position: relative;
      margin-bottom: 50px;
      width: 150px;
      height: 150px;
      background: #d9d9d9;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      em {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: #c9c9c9;
        position: absolute;
        bottom: 0;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        &::after {
          content: "";
          display: block;
          background: url(/images/ico/ico-setting.png) no-repeat center;
          background-size: cover;
          width: 16px;
          height: 16px;
        }
      }

      figure {
        max-width: 100px;
      }
    }
    .l-txt {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      span {
        display: block;
        color: #333;
        font-size: 20px;
      }
      strong {
        font-size: 30px;
      }
    }

    @media screen and (max-width: 1080px) {
      width: 100%;
    }
  }
  &.right {
    width: 70%;
    background: #fff;
    @media screen and (max-width: 1080px) {
      width: 100%;
    }
    .title {
      margin-bottom: 20px;
      h2 {
        font-size: 24px;
        font-weight: bold;
      }
    }
  }
`;

export const SubTitle = styled.strong`
  display: block;
  font-size: 18px;
  margin-bottom: 10px;
  font-weight: bold;
`;

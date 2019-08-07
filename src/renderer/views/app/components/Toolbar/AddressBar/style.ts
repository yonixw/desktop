import styled, { css } from 'styled-components';
import { colors } from '~/renderer/constants';
import { body2 } from '~/renderer/mixins';

export const Input = styled.input`
  border: none;
  flex: 1;
  height: 100%;
  background-color: transparent;

  overflow: hidden;
  outline: none;
  padding-left: 8px;

  ${body2()};
  font-size: 13px;
  display: flex;
  align-items: center;
`;

export const StyledAddressBar = styled.div`
  background-color: rgba(0, 0, 0, 0.03);
  transition: 0.2s background-color;
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  margin-left: 8px;
  margin-right: 8px;
  height: 28px;
  border-radius: 6px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
  }

  ${({ focus }: { focus: boolean }) =>
    focus &&
    css`
      box-shadow: 0 0 0 2px ${colors.blue['100']};
      background-color: white;
      transition: none;

      &:hover {
        background-color: white;
      }
    `};
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  margin-right: 2px;
`;

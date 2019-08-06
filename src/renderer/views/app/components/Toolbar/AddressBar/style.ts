import styled from 'styled-components';
import { colors } from '~/renderer/constants';
import { body2 } from '~/renderer/mixins';

export const Input = styled.input`
  background-color: rgba(0, 0, 0, 0.03);
  border: none;
  flex: 1;
  height: 28px;
  border-radius: 4px;
  overflow: hidden;
  outline: none;
  padding-left: 8px;
  transition: 0.2s background-color;
  ${body2()};
  font-size: 13px;
  display: flex;
  align-items: center;

  &:focus {
    box-shadow: 0 0 0 2px ${colors.blue['100']};
    background-color: white;
    transition: none;

    &:hover {
      background-color: white;
    }
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
  }
`;

export const Actions = styled.div`
  position: absolute;
  right: 0px;
`;

export const StyledAddressBar = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  margin-left: 8px;
  margin-right: 8px;
`;

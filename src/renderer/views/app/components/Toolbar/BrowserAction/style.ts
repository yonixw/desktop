import styled, { css } from 'styled-components';

export const StyledBrowserAction = styled.div`
  position: relative;
`;

interface BadgeProps {
  background?: string;
  color?: string;
  addressBar?: boolean;
}

export const Badge = styled.div`
  position: absolute;
  padding: 1px 3px;
  border-radius: 8px;

  top: 6px;
  pointer-events: none;
  right: 4px;
  z-index: 5;
  font-size: 8px;
  ${({ background, color, addressBar }: BadgeProps) => css`
    background-color: ${background};
    color: ${color};
    right: ${addressBar ? 0 : 4}px;
    top: ${addressBar ? 0 : 6}px;
  `};
`;

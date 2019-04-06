import { css } from "styled-components";

const lower = {
  desktop: 768,
  mobile: 0
};

const upper = {
  desktop: 99999,
  mobile: 768
};

const media = Object.keys(lower).reduce((acc, device) => {
  acc[device] = (...args) => css`
    @media (min-width: ${lower[device] / 16}em) and (max-width: ${upper[
        device
      ] / 16}em) {
      ${css(...args)};
    }
  `;

  return acc;
}, {});

export default media;

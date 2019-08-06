import * as React from 'react';
import { parse } from 'url';
import { ipcRenderer } from 'electron';
import { observer } from 'mobx-react-lite';

import { StyledAddressBar, Actions, Input } from './style';
import { loadURL } from '../../../utils';
import { isURL } from '~/utils';
import store from '../../../store';
import { ToolbarButton } from '../ToolbarButton';
import { BrowserAction } from '../BrowserAction';
import { icons, colors } from '~/renderer/constants';

const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.which === 13) {
    // Enter.
    e.preventDefault();

    const text = e.currentTarget.value;
    let url = text;

    if (isURL(text) && !text.includes('://')) {
      url = `http://${text}`;
    } else if (!text.includes('://')) {
      url = store.searchEngine.url.replace('%s', text);
    }

    e.currentTarget.value = url;

    loadURL(url);
  }
};

const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { selectedTab } = store.tabs;
  if (selectedTab) {
    selectedTab.addressBarText = e.currentTarget.value;
  }
};

const onFocus = () => {
  store.inputFocused = true;
  requestAnimationFrame(() => {
    store.inputRef.current.select();
  });
};

const onBlur = () => {
  store.inputFocused = false;
  store.inputRef.current.setSelectionRange(0, 0);
};

const onKeyClick = async () => {
  const { hostname } = parse(store.tabs.selectedTab.url);

  const list = (await store.formFill.db.get({
    type: 'password',
    url: hostname,
  })).filter(r => r.fields.username);

  ipcRenderer.send(`credentials-show-${store.windowId}`, {
    content: 'list',
    list,
  });
};

export const AddressBar = observer(() => {
  const { selectedTab } = store.tabs;

  let isWindow = false;
  let blockedAds = 0;
  let hasCredentials = false;

  if (selectedTab) {
    isWindow = selectedTab.isWindow;
    blockedAds = selectedTab.blockedAds;
    hasCredentials = selectedTab.hasCredentials;
  }

  return (
    <StyledAddressBar>
      <Input
        placeholder="Search in Google or type an URL"
        onChange={onChange}
        onKeyPress={onKeyPress}
        value={selectedTab ? selectedTab.addressBarText : ''}
        onBlur={onBlur}
        onFocus={onFocus}
        ref={store.inputRef}
      ></Input>
      <Actions>
        {hasCredentials && (
          <ToolbarButton icon={icons.key} size={16} onClick={onKeyClick} />
        )}
        {!isWindow && (
          <BrowserAction
            size={18}
            style={{ marginLeft: 0, marginRight: 0 }}
            opacity={0.54}
            autoInvert
            data={{
              badgeBackgroundColor: colors.blue['500'],
              badgeText: blockedAds > 0 ? blockedAds.toString() : '',
              icon: icons.shield,
              badgeTextColor: 'white',
            }}
          />
        )}
      </Actions>
    </StyledAddressBar>
  );
});

import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { ipcRenderer } from 'electron';

import store from '../../store';
import { Buttons, StyledToolbar, Separator } from './style';
import { NavigationButtons } from './NavigationButtons';
import { ToolbarButton } from './ToolbarButton';
import { icons } from '~/renderer/constants';
import { BrowserAction } from './BrowserAction';
import { AddressBar } from './AddressBar';

const onUpdateClick = () => {
  ipcRenderer.send('update-install');
};

const BrowserActions = observer(() => {
  const { selectedTabId } = store.tabGroups.currentGroup;

  return (
    <>
      {selectedTabId &&
        store.extensions.browserActions.map(item => {
          if (item.tabId === selectedTabId) {
            return <BrowserAction data={item} key={item.extensionId} />;
          }
          return null;
        })}
    </>
  );
});

export const Toolbar = observer(() => {
  return (
    <StyledToolbar isHTMLFullscreen={store.isHTMLFullscreen}>
      <NavigationButtons />
      <AddressBar />
      <Buttons>
        <BrowserActions />
        {store.updateInfo.available && (
          <ToolbarButton icon={icons.download} onClick={onUpdateClick} />
        )}
        {store.extensions.browserActions.length > 0 && <Separator />}
        {store.isIncognito && (
          <>
            <Separator />
            <ToolbarButton icon={icons.incognito} size={18} />
          </>
        )}
      </Buttons>
    </StyledToolbar>
  );
});

import React from 'react';
import { observer } from 'mobx-react';

import Section from '../Section';
import store from '@history/store';
import NavigationDrawer from '@/components/NavigationDrawer';
import { icons } from '@/constants/renderer';
import Preloader from '@/components/Preloader';
import { StyledApp, PageContainer, Content } from './styles';

declare const global: any;

const actions = {
  selectAll: () => {
    const { selectedItems, historyItems } = store;
    for (const item of historyItems) {
      selectedItems.push(item._id);
    }
  },
  deselectAll: () => {
    store.selectedItems = [];
  },
  deleteAllSelected: () => {
    store.removeItem(...store.selectedItems);
    store.selectedItems = [];
  },
};

@observer
export default class App extends React.Component {
  componentDidMount() {
    global.onIpcReceived.addListener((name: string, data: any) => {
      if (name === 'history') {
        store.historyItems = Object.values(data);

        store.filterItems();
        store.loadSections(20);

        store.loading = false;
      } else if (name === 'dictionary') {
        store.dictionary = data;
      }
    });

    window.addEventListener('scroll', this.onWindowScroll);

    window.addEventListener('keydown', e => {
      store.cmdPressed = e.key === 'Meta';
    });

    window.addEventListener('keyup', e => {
      if (e.key === 'Meta') {
        store.cmdPressed = false;
      }
    });
  }

  public onWindowScroll = () => {
    const el = document.documentElement;
    const yPos = window.scrollY;
    const maxYPos = el.scrollHeight - el.clientHeight;
    const itemOffset = 4;

    if (yPos >= maxYPos - itemOffset * 56) {
      store.loadSections(20);
    }
  };

  public onSearch = (str: string) => {
    store.search(str.toLowerCase());
  };

  public render() {
    const selectedItems = store.selectedItems;
    const selected = selectedItems.length !== 0;

    return (
      <StyledApp>
        <NavigationDrawer title="History" onSearch={this.onSearch} search>
          <NavigationDrawer.Item
            title="Select all"
            icon={icons.selectAll}
            onClick={actions.selectAll}
            visible={store.historySections.length !== 0}
          />
          <NavigationDrawer.Item
            title="Delete selected"
            icon={icons.delete}
            visible={selected}
            onClick={actions.deleteAllSelected}
          />
          <NavigationDrawer.Item
            title="Clear"
            icon={icons.close}
            visible={selected}
            onClick={actions.deselectAll}
          />
        </NavigationDrawer>
        <PageContainer>
          {(!store.loading && (
            <Content>
              {store.historySections.map((section, key) => (
                <Section key={key} section={section} />
              ))}
            </Content>
          )) || (
            <Preloader
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          )}
        </PageContainer>
      </StyledApp>
    );
  }
}

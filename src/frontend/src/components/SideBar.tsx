import React, { useEffect, useState } from 'react';
import { AutoComplete, Button, Col, Form, Row, Modal, Menu } from 'antd';
import {
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';

import type { MenuProps } from 'antd';

export type MenuItem = Required<MenuProps>['items'][number];

export type SideBarProps = {
  items: MenuItem[];
};

export default function SideBar(props: SideBarProps) {
  const [collapsed, setCollapsed] = useState(true);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Col
      style={{
        width: collapsed ? '50px' : '200px',
        transition: 'width 0.3s ease-in-out',
        background: '#001529',
        position: 'absolute',
        top: 0,
        left: 0,
        height: collapsed ? '100%' : '100vh',
        flexDirection: 'column',
        flexShrink: 0,
        zIndex: 1000,
        boxShadow: collapsed ? 'none' : '2px 0 5px rgba(0, 0, 0, 0.2)',
      }}
      flex={collapsed ? '50px' : '200px'}
    >
      <div
        style={{
          height: '100%',
          width: '100%',
        }}
      >
        <Button
          type='primary'
          onClick={toggleCollapsed}
          style={{
            marginBottom: 16,
            alignSelf: 'center',
            marginLeft: '10px',
          }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
        {!collapsed && (
          <Menu
            style={{
              width: '100%',
              height: '100%',
            }}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode='inline'
            theme='dark'
            inlineCollapsed={collapsed}
            items={props.items}
          />
        )}
      </div>
    </Col>
  );
}

// Ayasdi Inc. Copyright 2017 - all rights reserved.

import React from 'react';
import { shallow } from 'enzyme';
import Icon from '../Icon';

describe('<Icon />', () => {
  const wrapper = shallow(<Icon icon="someicon" />);

  it('adds an icon svg with the proper id', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

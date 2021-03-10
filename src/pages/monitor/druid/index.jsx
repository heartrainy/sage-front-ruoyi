import React, { useState, useEffect } from 'react';
import { requestPrefix } from '@/services/prefix';

function Druid() {

  useEffect(() => {
    
  }, [])

  return (
    <div style={{height: 'calc(100vh - 90px - 40px)'}}>
      <iframe src={`/${requestPrefix}/druid/index.html`} frameBorder="no" style={{ width: '100%', height: '100%' }} scrolling="auto" />
    </div>
  );
}

export default Druid;

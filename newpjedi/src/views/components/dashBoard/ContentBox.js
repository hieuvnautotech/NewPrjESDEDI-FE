import React, { Suspense } from 'react';

import { LoaderOverlay } from '@components';

const ContentBox = (props) => {
  const { title, languageKey, breadcrumb, children } = props;
  return (
    <section className="content">
      <div className="wrapper">
        <div className="content-wrapper">
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-left">
                    {breadcrumb &&
                      breadcrumb.map((rank, i, row) => {
                        if (i + 1 === row.length) {
                          // Last one.
                          return (
                            <li key={i} className="breadcrumb-item">
                              <span className="badge badge-info" style={{ fontSize: '16px' }}>
                                {title}
                              </span>
                            </li>
                          );
                        } else {
                          // Not last one.
                          return (
                            <li key={i} className="breadcrumb-item">
                              {row[i]}
                            </li>
                          );
                        }
                      })}
                  </ol>
                </div>
              </div>
            </div>
          </section>

          <Suspense fallback={<LoaderOverlay />}>
            <div className="row shadow pt-2">
              <div className="col-12">{children}</div>
            </div>
          </Suspense>
        </div>
      </div>
    </section>
  );
};

export default ContentBox;

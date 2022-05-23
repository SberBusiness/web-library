import {Footer} from '@sbbol/web-library/desktop/components/Footer/Footer';
import * as React from 'react';

export const ModalWindowFooter: React.FC = ({children}) => (
    <div>
        <Footer className="cssClass[modalWindowFooter]">{children}</Footer>
    </div>
);

ModalWindowFooter.displayName = 'ModalWindowFooter';

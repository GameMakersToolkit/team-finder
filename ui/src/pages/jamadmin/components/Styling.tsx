import { CommonFields } from './styling/CommonFields.tsx';
import {SkillsToolsLanguagesTimezones} from './styling/SkillsToolsLanguagesTimezones.tsx';

export const Styling = () => {

    return (
        <div className="c-admin-styling">
            <h2>Styling</h2>
            <CommonFields />
            <SkillsToolsLanguagesTimezones />
        </div>
    )
}


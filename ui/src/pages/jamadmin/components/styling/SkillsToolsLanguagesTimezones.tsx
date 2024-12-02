import React, {useContext} from 'react';
import {JamSpecificContext} from '../../../../common/components/JamSpecificStyling.tsx';
import {BaseFieldLabel} from './BaseFieldLabel.tsx';
import {BaseFieldColourInput} from './BaseFieldColourInput.tsx';
import {CustomSelectOption} from '../../../jamhome/components/common/CustomSelect.tsx';
import {skills} from '../../../../common/models/skills.tsx';
import {tools} from '../../../../common/models/engines.tsx';
import {timezones} from '../../../../common/models/timezones.ts';
import {languages} from '../../../../common/models/languages.ts';
import {Post as PostModel} from '../../../../common/models/post.ts';
import {PostTile} from '../../../../common/components/PostTile.tsx';

export const SkillsToolsLanguagesTimezones = () => {
    const theme = useContext(JamSpecificContext)

    const skillsEnginesLanguages = [
        {name: "--skill-color-looking-for", description: "'Looking For' pill background colour"},
        {name: "--skill-color-looking-for-text", description: "'Looking For' pill text colour"},
        {name: "--skill-color-possessed", description: "'Can Do' pill background colour"},
        {name: "--skill-color-possessed-text", description: "'Can Do' pill text colour"},
        {name: "--skill-color-engines", description: "Tools pill background colour"},
        {name: "--skill-color-engines-text", description: "Tools pill text colour"},
        {name: "--skill-color-languages", description: "'Looking For' pill background colour"},
        {name: "--skill-color-languages-text", description: "'Looking For' pill text colour"},
        {name: "--skill-color-timezones", description: "'Looking For' pill background colour"},
        {name: "--skill-color-timezones-text", description: "'Looking For' pill text colour"},
    ]

    return (
        <>
            <h3 className="text-2xl text-center mb-4">Post skills/engines/languages</h3>
            <div className="flex justify-center mb-64">
                <div className="w-[33%]">
                    <form>
                        {skillsEnginesLanguages.map(field => (
                            <div className="flex justify-around mb-4">
                                <BaseFieldLabel field={field}/>
                                <BaseFieldColourInput
                                    field={field}
                                    initialValue={theme.styles[field.name] || '#FFFFFF'}
                                    document={document}
                                />
                            </div>
                        ))}
                    </form>
                </div>
                <div className="w-[66%]">
                    <div className="px-8 m-auto">
                        <PostTile post={dummyPost}/>
                    </div>
                </div>
            </div>
        </>
    )
}


const getRandomListOfModel = (modelType: CustomSelectOption[], maxNumber: number) => modelType
    .map(model => model.value)
    .sort(() => 0.5 - Math.random())
    .slice(0, 1 + Math.ceil(Math.random() * (maxNumber - 1)));

const dummyPost = {
    id: 'admin-preview-post',
    jamId: "none",
    author: "Test Admin Post",
    authorId: "admin",
    description: "This is an example Post you can use to test your styling changes on!\n\nTry changing colours and this should update in real time!",
    size: 2,
    skillsPossessed: getRandomListOfModel(skills, 6),
    skillsSought: getRandomListOfModel(skills, 6),
    preferredTools: getRandomListOfModel(tools, 3),
    availability: "",
    timezoneOffsets: getRandomListOfModel(timezones, 3),
    languages: getRandomListOfModel(languages, 3),
    isFavourite: true,
    reportCount: 0,
    unableToContactCount: 0,
    createdAt: new Date(),
} as PostModel;
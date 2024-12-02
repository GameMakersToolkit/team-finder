import React, {useContext, useState} from 'react';
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
import {Post as FullPagePost} from '../../../post/Post.tsx';

export const SkillsToolsLanguagesTimezones = () => {

    const [postType, setPostType] = useState("tile")

    const skillsEnginesLanguages = [
        {subtitle: "Looking For", name: "--skill-color-looking-for", description: ""},
        {subtitle: "Can Do", name: "--skill-color-possessed", description: ""},
        {subtitle: "Tools", name: "--skill-color-engines", description: ""},
        {subtitle: "Languages", name: "--skill-color-languages", description: ""},
        {subtitle: "Timezones", name: "--skill-color-timezones", description: ""},
    ]

    return (
        <>
            <h3 className="text-2xl text-center mb-4">Post skills/engines/languages</h3>
            <div className="flex justify-center mb-64">
                <div className="w-[33%]">
                    <form>
                        {skillsEnginesLanguages.map(field => (
                            <FieldPair field={field} />
                        ))}
                    </form>
                </div>
                <div className="w-[66%]">
                    <div className="px-8 m-auto">
                        <div className={`m-auto ${postType == 'tile' ? 'w-[400px]' : 'w-[800px]'}`}>
                            <nav className="m-auto text-center mb-4">
                                <button className={`nav--button ${postType == 'tile' && 'active'}`} type="button" onClick={() => setPostType("tile")}>View post tile</button>
                                <button className={`nav--button ${postType == 'tile' && 'active'}`} type="button" onClick={() => setPostType("full")}>View full page post</button>
                            </nav>
                            {postType == 'tile' && <PostTile post={dummyPost}/>}
                            {postType != 'tile' && <FullPagePost initialPost={dummyPost}/>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const FieldPair = ({field}) => {
    const theme = useContext(JamSpecificContext)

    return (
        <>
            <h4 className="text-xl mt-8 mb-4">{field.subtitle}</h4>
            <div className="flex justify-around mb-4">
                <div className="grid grid-cols-4">
                <BaseFieldLabel field={{...field, description: "Background colour"}}/>
                <BaseFieldColourInput
                    field={field}
                    initialValue={theme.styles[field.name] || '#FFFFFF'}
                    document={document}
                />

                <BaseFieldLabel field={{...field, description: "Text colour"}}/>
                <BaseFieldColourInput
                    field={field}
                    initialValue={theme.styles[field.name + "-text"] || '#FFFFFF'}
                    document={document}
                />
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
    jamId: 'none',
    author: 'Test Admin Post',
    authorId: 'admin',
    description: 'This is an example Post you can use to test your styling changes on!\n\nTry changing colours and this should update in real time!',
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
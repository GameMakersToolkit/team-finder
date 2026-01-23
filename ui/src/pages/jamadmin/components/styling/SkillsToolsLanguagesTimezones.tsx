import React, { useContext, useEffect, useState } from "react";
import { Jam, JamSpecificContext } from "../../../../common/components/JamSpecificStyling.tsx";
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
import { getPreviewCacheKey, JamPreviewStyling } from "../../../../common/components/JamPreviewStyling.tsx";

export const SkillsToolsLanguagesTimezones = ({themeFields, setThemeFields}) => {

    const theme = useContext(JamSpecificContext)
    const [renderState, setRenderState] = useState(0);
    const [postType, setPostType] = useState("tile")

    useEffect(() => {
      const previewThemeCacheKey = getPreviewCacheKey(theme.jamId);
      const styles = {}
      themeFields.forEach(field => styles[field.name] = field.currentValue)
      const previewTheme: Jam = {...theme, styles: styles} as Jam
      localStorage.setItem(previewThemeCacheKey, JSON.stringify(previewTheme))
      setRenderState(Math.random())
    }, [themeFields])

    return (
        <>
            <h3 className="text-2xl text-center mb-4">Post skills/engines/languages</h3>
            <div className="flex justify-center mb-64">
                <div className="w-[33%]">
                    {themeFields.filter(f => f.ctx == "skill").map(field => (
                        <FieldPair
                          field={field}
                          themeFields={themeFields}
                          setThemeFields={setThemeFields}
                        />
                    ))}
                </div>
                <div className="w-[66%]">
                    <div className="px-8 m-auto">
                        <div className={`m-auto ${postType == 'tile' ? 'w-[400px]' : 'w-[800px]'}`}>
                            <nav className="m-auto text-center mb-4">
                                <button className={`nav--button ${postType == 'tile' && 'active'}`} type="button" onClick={() => setPostType("tile")}>View post tile</button>
                                <button className={`nav--button ${postType == 'tile' && 'active'}`} type="button" onClick={() => setPostType("full")}>View full page post</button>
                            </nav>
                              <JamPreviewStyling renderState={renderState} slim={true}>
                                {postType == 'tile' && <PostTile post={dummyPost}/>}
                                {postType != 'tile' && <FullPagePost initialPost={dummyPost}/>}
                              </JamPreviewStyling>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const FieldPair = ({field, themeFields, setThemeFields}) => {
    return (
        <>
            <h4 className="text-xl mt-8 mb-4">{field.subtitle}</h4>
            <div className="flex justify-around mb-4">
                <div className="grid grid-cols-4">
                <BaseFieldLabel field={field}/>
                <BaseFieldColourInput
                    field={field}
                    themeFields={themeFields}
                    setThemeFields={setThemeFields}
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

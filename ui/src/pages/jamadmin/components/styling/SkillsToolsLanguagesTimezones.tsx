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
import { ThemeField } from "./CommonFields.tsx";
import { getPreviewCacheKey } from "../../../../common/components/JamPreviewStyling.tsx";

export const SkillsToolsLanguagesTimezones = () => {

    const theme = useContext(JamSpecificContext)
    const [themeFields, setThemeFields] = useState(getThemeFields(theme))
    const [postType, setPostType] = useState("tile")

    useEffect(() => {
      const previewThemeCacheKey = getPreviewCacheKey(theme.jamId);
      const styles = {}
      themeFields.forEach(field => styles[field.name] = field.currentValue)
      const previewTheme: Jam = {...theme, styles: styles} as Jam
      localStorage.setItem(previewThemeCacheKey, JSON.stringify(previewTheme))
    }, [themeFields])

    return (
        <>
            <h3 className="text-2xl text-center mb-4">Post skills/engines/languages</h3>
            <div className="flex justify-center mb-64">
                <div className="w-[33%]">
                    <form>
                        {themeFields.map(field => (
                            <FieldPair
                              field={field}
                              themeFields={themeFields}
                              setThemeFields={setThemeFields}
                            />
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

function getThemeFields(theme: Jam): ThemeField[] {
  return [
    {
      name: "--skill-color-looking-for",
      description: "--skill-color-looking-for",
      currentValue: theme.styles["--skill-color-looking-for"],
    },
    {
      name: "--skill-color-looking-for-text",
      description: "--skill-color-looking-for-text",
      currentValue: theme.styles["--skill-color-looking-for-text"],
    },
    {
      name: "--skill-color-possessed",
      description: "--skill-color-possessed",
      currentValue: theme.styles["--skill-color-possessed"],
    },
    {
      name: "--skill-color-possessed-text",
      description: "--skill-color-possessed-text",
      currentValue: theme.styles["--skill-color-possessed-text"],
    },
    {
      name: "--skill-color-engines",
      description: "--skill-color-engines",
      currentValue: theme.styles["--skill-color-engines"],
    },
    {
      name: "--skill-color-engines-text",
      description: "--skill-color-engines-text",
      currentValue: theme.styles["--skill-color-engines-text"],
    },
    {
      name: "--skill-color-languages",
      description: "--skill-color-languages",
      currentValue: theme.styles["--skill-color-languages"],
    },
    {
      name: "--skill-color-languages-text",
      description: "--skill-color-languages-text",
      currentValue: theme.styles["--skill-color-languages-text"],
    },
    {
      name: "--skill-color-timezones",
      description: "--skill-color-timezones",
      currentValue: theme.styles["--skill-color-timezones"],
    },
    {
      name: "--skill-color-timezones-text",
      description: "--skill-color-timezones-text",
      currentValue: theme.styles["--skill-color-timezones-text"],
    },
  ];
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

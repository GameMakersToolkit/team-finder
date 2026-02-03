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
import { PostBody as FullPagePost } from "../../../post/Post.tsx";
import { getPreviewCacheKey, JamPreviewStyling } from "../../../../common/components/JamPreviewStyling.tsx";

export const SkillsToolsLanguagesTimezones = ({themeFields, setThemeFields}) => {

    const theme = useContext(JamSpecificContext)
    const [renderState, setRenderState] = useState(0);

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
            <div className="grid grid-cols-3 mb-8">
                <div className="mb-4">
                    <h4 className="text-xl _text-center mb-2">Post</h4>
                    <FieldPair field={themeFields[5]} themeFields={themeFields} setThemeFields={setThemeFields} />
                    <FieldPair field={themeFields[6]} themeFields={themeFields} setThemeFields={setThemeFields} />
                </div>

                <div className="mb-4">
                  <h4 className="text-xl _text-center mb-2">Looking For</h4>
                  <FieldPair field={themeFields[7]} themeFields={themeFields} setThemeFields={setThemeFields} />
                  <FieldPair field={themeFields[8]} themeFields={themeFields} setThemeFields={setThemeFields} />
                </div>

                <div className="mb-4">
                  <h4 className="text-xl _text-center mb-2">Skills Possessed</h4>
                  <FieldPair field={themeFields[9]} themeFields={themeFields} setThemeFields={setThemeFields} />
                  <FieldPair field={themeFields[10]} themeFields={themeFields} setThemeFields={setThemeFields} />
                </div>

                <div className="mb-4">
                  <h4 className="text-xl _text-center mb-2">Preferred Engines</h4>
                  <FieldPair field={themeFields[11]} themeFields={themeFields} setThemeFields={setThemeFields} />
                  <FieldPair field={themeFields[12]} themeFields={themeFields} setThemeFields={setThemeFields} />
                </div>

                <div className="mb-4">
                  <h4 className="text-xl _text-center mb-2">Languages</h4>
                  <FieldPair field={themeFields[13]} themeFields={themeFields} setThemeFields={setThemeFields} />
                  <FieldPair field={themeFields[14]} themeFields={themeFields} setThemeFields={setThemeFields} />
                </div>

                <div className="mb-4">
                  <h4 className="text-xl _text-center mb-2">Timezones</h4>
                  <FieldPair field={themeFields[15]} themeFields={themeFields} setThemeFields={setThemeFields} />
                  <FieldPair field={themeFields[16]} themeFields={themeFields} setThemeFields={setThemeFields} />
                </div>
              </div>
              <div className="w-auto m-auto">
                  <JamPreviewStyling renderState={renderState} slim={true}>
                    <div className="flex flex-row justify-between">
                      <div className="m-h-[700px] pt-1">
                        <PostTile post={dummyPost}/>
                      </div>
                      <div className="m-h-[800px]">
                        <FullPagePost post={dummyPost}/>
                      </div>
                    </div>
                  </JamPreviewStyling>
            </div>
        </>
    )
}

const FieldPair = ({field, themeFields, setThemeFields}) => {
    return (
        <div className="flex flex-row justify-items-center gap-4 items-center mb-2">
            <BaseFieldLabel field={field}/>
            <BaseFieldColourInput
                field={field}
                themeFields={themeFields}
                setThemeFields={setThemeFields}
            />
        </div>
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

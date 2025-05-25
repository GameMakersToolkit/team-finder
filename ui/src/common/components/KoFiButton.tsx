import logo from '../../assets/icons/kofi/kofi_symbol.png'

export const KoFiButton = () => {
    return (
        <a
            href='https://ko-fi.com/U7U01FEUVS'
            target='_blank'
            className="sticky left-4 bottom-4 flex w-[36px]"
        >
            <img
                src={logo}
                alt='Help me keep the lights on - visit my ko-fi page!'
            />
        </a>
    )
}

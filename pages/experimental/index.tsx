import {NextPage} from "next";

type Props = {}

const Experimental: NextPage<Props> = (props) => {

    return (
        <>
            <div>
                aaaaaaaaa
            </div>
            <style jsx>{`
              div {
                position: absolute;
                left: 0;
                top: 0;
                animation: slideIn 2s ease-in 1s infinite;
              }
              
              @keyframes slideIn {
                0%{
                  left: 0;
                  filter: drop-shadow(0px 0px 1px #0000ee);
                }
                50%{
                  left: 100%;
                  filter: drop-shadow(0px 100px 100px #0000ee);
                }
                100%{
                  left: 0;
                  filter: drop-shadow(0px 0px 1px #0000ee);
                }
              }

            `}</style>
        </>
    );
}

export default Experimental;
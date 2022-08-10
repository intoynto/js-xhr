import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
//import external from "rollup-plugin-peer-deps-external";
//import dts from "rollup-plugin-dts";
//import alias from '@rollup/plugin-alias';

const packageJson=require("./package.json");

export default [
    {
        input:"src/index.ts",
        output:[
            {
                file:packageJson.main,
                format:"umd",
                sourcemap:true,
                name:packageJson.name,
                globals:{
                    //react:"React",
                    //"intoy-modal":"intoy-modal",
                    "intoy-utils":"intoy-utils",
                    //"intoy-xhr":"intoy-xhr",
                    //"intoy-select":"intoy-select",
                },
            },            
        ],
        external:[
            //"react",
            //"react-dom",
            //"intoy-modal",
            //"intoy-select",
            "intoy-utils",
            //"intoy-xhr",
        ],
        plugins:[
            typescript({tsconfig:"./tsconfig.json"}),

            /*
            alias({
                entries: [
                    { find: 'react', replacement: 'preact/compat' },
                    { find: 'react-dom/test-utils', replacement: 'preact/test-utils' },
                    { find: 'react-dom', replacement: 'preact/compat' },
                    { find: 'react/jsx-runtime', replacement: 'preact/jsx-runtime' }
                ]
            }),            
            */
           
            babel({
                exclude: /node_modules/,
                presets: [
                    ["@babel/preset-env", { loose: true }],
                    //"@babel/preset-react",
                    "@babel/preset-typescript",
                ],
                //plugins: ["babel-plugin-dev-expression"],
                extensions: [".ts", ".tsx"],
            }),
            
            commonjs(),
            resolve(),
            terser({
                format:{
                    comments:false,
                }
            }),
        ],
    },
    /*
    {
        input:"dist/esm/types/index.d.ts",
        output:[
            {
                file:"dist/index.d.ts",
                format:"esm"
            }
        ],        
        plugins:[
            dts()
        ]
    }
    */
];
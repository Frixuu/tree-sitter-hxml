/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
    name: "hxml",
    extras: _ => [/\s/],
    rules: {
        hxml: $ => repeat($._line),
        next: $ => "--next",
        each: $ => "--each",

        /////////////////////
        _line: $ =>
            choice(
                $.class_path,
                $.dce,
                $.main,
                $.output,
                $.cmd,
                $.cwd,
                $.hxml_file,
                $.types_desc,
                $.c_arg,
                $.library,
                $.define,
                $.resource,
                $.remap,
                $.server_listen,
                $.server_connect,
                $.connect,
                $.comment,
                $.macro,
                $.switch,

                $.next,
                $.each,

                prec.right(10, $.no_param),
                prec.right(11, $.one_param),
            ),

        hxml_file: $ => field("hxml_file", /.*\.hxml/),

        class_path: $ =>
            seq(alias($.flag_class_path, $.flag), $._ws, field("path", $.text)),

        ////////////////////
        output: $ =>
            choice(
                seq(
                    alias(
                        choice(
                            "-js",
                            "--js",
                            "-swf",
                            "--swf",
                            "-neko",
                            "--neko",
                            "-jvm",
                            "--jvm",
                            "-python",
                            "--python",
                            "-lua",
                            "--lua",
                            "-hl",
                            "--hl",
                            "-cppia",
                            "--cppia",
                            "-x",
                        ),
                        $.flag,
                    ),
                    field("file", $.text),
                ),
                seq(
                    alias(
                        choice(
                            "-php",
                            "--php",
                            "-cpp",
                            "--cpp",
                            "-cs",
                            "--cs",
                            "-java",
                            "--java",
                        ),
                        $.flag,
                    ),
                    field("directory", $.text),
                ),
                seq(
                    alias(choice("--custom-target", "-custom"), $.flag),
                    $.text,
                ),
                alias(choice("--no-output", "--interp"), $.flag),
                seq(
                    alias("--run", $.flag),
                    field("main", $.text),
                    repeat($.text),
                ),
            ),

        cmd: $ => seq(alias($.flag_cmd, $.flag), field("command", $.text)),
        cwd: $ => seq(alias($.flag_cwd, $.flag), field("path", $.text)),

        types_desc: $ =>
            seq(
                alias(choice($.flag_xml, $.flag_json), $.flag),
                field("path", $.text),
            ),

        c_arg: $ => seq(alias($.flag_c_arg, $.flag), field("arg", $.text)),

        dce: $ =>
            seq(
                alias($.flag_dce, $.flag),
                field("mode", choice("std", "full", "no")),
            ),

        main: $ => seq(alias($.flag_main, $.flag), field("class", $.text)),

        library: $ =>
            seq(
                alias($.flag_library, $.flag),
                field("name", $.identifier),
                optional(
                    seq(
                        token.immediate(":"),
                        choice(
                            // Haxelib
                            field("version", $.version),

                            // Git
                            prec.left(
                                seq(
                                    token.immediate("git"),
                                    token.immediate(":"),
                                    field("url", $.git_url),
                                    optional(
                                        seq(
                                            token.immediate("#"),
                                            field("ref", $.git_ref),
                                        ),
                                    ),
                                ),
                            ),
                        ),
                    ),
                ),
            ),

        define: $ =>
            seq(
                alias($.flag_define, $.flag),
                field(
                    "define",
                    seq(
                        field("var", $.text),
                        optional(seq("=", field("value", $.value))),
                    ),
                ),
            ),

        resource: $ =>
            seq(
                alias($.flag_resource, $.flag),
                field(
                    "resource",
                    seq(
                        field("file", $.text),
                        optional(seq("@", field("name", $.text))),
                    ),
                ),
            ),

        remap: $ =>
            seq(
                alias($.flag_remap, $.flag),
                field("package", $.text),
                ":",
                field("target", $.text),
            ),

        server_listen: $ =>
            seq(
                alias($.flag_server_listen, $.flag),
                optional(
                    choice(
                        "stdio",
                        field("port", $.number),
                        seq(
                            field("host", $.text),
                            token.immediate(":"),
                            field("port", $.number),
                        ),
                    ),
                ),
            ),

        server_connect: $ =>
            seq(
                alias($.flag_server_connect, $.flag),
                optional(
                    choice(
                        field("port", $.number),
                        seq(
                            field("host", $.text),
                            ":",
                            field("port", $.number),
                        ),
                    ),
                ),
            ),

        connect: $ =>
            seq(
                alias($.flag_connect, $.flag),
                optional(
                    choice(
                        field("port", $.number),
                        seq(
                            field("host", $.text),
                            ":",
                            field("port", $.number),
                        ),
                    ),
                ),
            ),

        macro: $ =>
            seq(
                alias($.flag_macro, $.flag),
                field("expression", $.haxe_expression),
            ),

        //////////////////////////
        comment: $ => seq("#", /.+/),

        ////////////////////
        // generic ones
        no_param: $ => choice(/--[a-z]*/, /-[A-Za-z]*/),
        one_param: $ =>
            seq(field("option", $.no_param), field("value", $.text)),

        switch: _ =>
            choice(
                choice("--debug", "-debug"),
                "--display",
                "--flash-strict",
                "--haxelib-global",
                choice("--help", "-help", "-h"),
                "--help-defines",
                "--help-metas",
                "--help-user-defines",
                "--help-user-metas",
                "--no-inline",
                "--no-opt",
                "--no-traces",
                choice("--prompt", "-prompt"),
                "--times",
                choice("--verbose", "-v"),
                choice("--version", "-version"),
            ),

        flag_c_arg: _ => "--c-arg",
        flag_class_path: _ => choice("--class-path", "-cp", "-p", "-libcp"),
        flag_cmd: _ => choice("--cmd", "-cmd"),
        flag_connect: _ => "--connect",
        flag_cwd: _ => choice("--cwd", "-C"),
        flag_dce: _ => choice("--dce", "-dce"),
        flag_define: _ => choice("-D", "--define"),
        flag_hxb: _ => "--hxb",
        flag_hxb_lib: _ => choice("--hxb-lib", "-hxb-lib"),
        flag_java_lib_extern: _ => "--java-lib-extern",
        flag_java_lib: _ => choice("--java-lib", "-java-lib"),
        flag_json: _ => "--json",
        flag_library: _ => choice("-L", "--library", "-lib"),
        flag_macro: _ => "--macro",
        flag_main: _ => choice("--main", "-main", "-m"),
        flag_neko_lib_path: _ => "--neko-lib-path",
        flag_net_lib: _ => "--net-lib",
        flag_net_std: _ => "--net-std",
        flag_remap: _ => "--remap",
        flag_resource: _ => choice("--resource", "-resource", "-r"),
        flag_server_connect: _ => choice("--server-connect", "--wait"),
        flag_server_listen: _ => "--server-listen",
        flag_swf_header: _ => choice("--swf-header", "-swf-header"),
        flag_swf_lib_extern: _ => choice("--swf-lib-extern", "-swf-lib-extern"),
        flag_swf_lib: _ => choice("--swf-lib", "-swf-lib"),
        flag_swf_version: _ => choice("--swf-version", "-swf-version"),
        flag_warning: _ => "-w",
        flag_xml: _ => choice("--xml", "-xml"),

        flag: $ =>
            choice(
                $.flag_c_arg,
                $.flag_class_path,
                $.flag_connect,
                $.flag_cwd,
                $.flag_dce,
                $.flag_define,
                $.flag_java_lib_extern,
                $.flag_java_lib,
                $.flag_json,
                $.flag_library,
                $.flag_macro,
                $.flag_main,
                $.flag_net_lib,
                $.flag_net_std,
                $.flag_remap,
                $.flag_resource,
                $.flag_server_connect,
                $.flag_server_listen,
                $.flag_swf_header,
                $.flag_swf_lib_extern,
                $.flag_swf_lib,
                $.flag_swf_version,
                $.flag_warning,
                $.flag_xml,
            ),

        ////////////////////

        identifier: $ => /[a-zA-Z_]+[a-zA-Z0-9]*/,
        git_url: _ => /[^(\#\s)]+/,
        git_ref: _ => /[\\.A-Za-z0-9\/_-]+/,
        version: _ => /[0-9]+\.[0-9]+\.[0-9]+/,

        text: $ => /[\\.A-Za-z\/_-]+/,
        value: $ => /[\\.A-Za-z0-9\/_-]+/,
        haxe_expression: $ => /[\\.A-Za-z0-9_-]+\(.*\)/,
        number: $ => /[0-9]+/,
        _ws: $ => repeat1(" "),
    },
});

module.exports = grammar({
	name: 'hxml',

	rules: {

		// TODO: put `next` back in here.
		hxml_content: $ => repeat($._line),

/*

THE OLD WAY THAT I WANT TO DO THIS, I WANT TO USE THE
--NEXT AND --EACH TO BE LIKE A SCOPE
		/////////////////////
		_section: $ => choice(
			prec(1,$.each),
			prec(2,$.next)
		),

		////////////////////
		next: $ => seq(
			repeat1($._line),
			'--next'
		),

		each: $ => seq(
			repeat1($._line),
			'--each'
		),
*/
		next: $ => '--next',
		each: $ => '--each',

		/////////////////////
		_line: $ => choice(
			$.class_path, $.dce, $.main, $.output,
			$.hxml_file, $.library, $.define, $.resource,
			$.remap, $.server_listen, $.server_connect,
			$.connect,

			$.next, $.each,

			prec.right(10,$.no_param),
			prec.right(11,$.one_param)
		),

		hxml_file: $ => field('hxml_file', /.*\.hxml/),

		/////////////////////
		class_path_id: $ => choice('--class-path','-cp','-p'),
		class_path: $ => seq(
			$.class_path_id, $._ws, field('class_path', $.text)
		),

		////////////////////
		output_id: $ => choice('--js', '--swf', '--neko', '--php', '--cpp',
			'--cs', '--java', '--jvm', '--python', '--lua', '--hl',
			'--cppia', '-x'
		),
		output_id_no_value: $ => choice('--no-output', '--interp'),
		output_id_run: $ => '--run',
		output: $ => choice(
			seq($.output_id, field('target', $.text)),
			$.output_id_no_value,
			seq($.output_id_run, field('main', $.text), repeat($.text))
		),

		/////////////////////
		dce_id: $ => '--dce',
		dce: $ => seq(
			$.dce_id,
			field("dce", choice('std', 'full', 'no'))
		),

		////////////////////
		main_id: $ => choice('--main', '-m'),
		main: $ => seq($.main_id, field('main', $.text)),

		////////////////////
		library_id: $ => choice('-L', '--library'),
		library: $ => seq(
			$.library_id,
			field('library', seq(
				field("name", $.text),
				optional(seq(":",field("version", $.value)))
			))
		),

		////////////////////
		define_id: $ => choice('-D', '--define'),
		define: $ => seq(
			$.define_id,
			field('define', seq(
				field("var",$.text),
				optional(seq("=",field("value", $.value)))
			))
		),

		////////////////////
		resource_id: $ => choice('-r', '--resource'),
		resource: $ => seq(
			$.resource_id,
			field('resource',seq(
				field("file",$.text),
				optional(seq("@",field("name", $.text)))
			))
		),

		////////////////////
		remap_id: $ => '--remap',
		remap: $ => seq(
			$.remap_id,
			field("package",$.text),
			":",
			field("target", $.text)
		),

		////////////////////
		server_listen_id: $ => '--server-listen',
		server_listen: $ => seq(
			$.server_listen_id,
			optional(choice(
				'stdio',
				field("port", $.number),
				seq(
					field("host",$.text),
					':',
					field("port", $.number)
				)
			))
		),

		///////////////////////////
		server_connect_id: $ => '--server-connect',
		server_connect: $ => seq(
			$.server_connect_id,
			optional(choice(
				field("port", $.number),
				seq(
					field("host",$.text),
					':',
					field("port", $.number)
				)
			))
		),

		///////////////////////////
		connect_id: $ => '--connect',
		connect: $ => seq(
			$.connect_id,
			optional(choice(
				field("port", $.number),
				seq(
					field("host",$.text),
					':',
					field("port", $.number)
				)
			))
		),


		////////////////////
		// generic ones
		no_param: $ => choice(/--[a-z]*/,/-[A-Za-z]*/),
		one_param: $ => seq(
			field('option', $.no_param),
			field('value',$.text)
		),

		////////////////////
		text: $ => /[\\.A-Za-z\/_-]+/,
		value: $ => /[\\.A-Za-z0-9\/_-]+/,
		number: $ => /[0-9]+/,
		_ws: $ => repeat1(' ')
	}
});
